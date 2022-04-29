import {ethers} from 'ethers'
import { useRouter } from 'next/router';
import {create as ipfsHttpClient} from 'ipfs-http-client'
import { useEffect, useState } from 'react';
import axios from 'axios'
import Web3Modal from 'web3modal'

const client =  ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
import {
    nftAddress,
    nftmarketAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/Nft.json'
import NFTMarket from '../artifacts/contracts/NFTMarketplace.sol/NFTMarket.json'


export default function CreateItem(){
    const[fileUrl, setFileUrl] = useState(null)
    const[formInput, updateFormInput] = useState({price:'', name:'', description:''})
    const Router = useRouter()

    async function onChange(e){
        const file = e.target.files[0]
        try{
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log( `recieved: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        }
        catch(err){
            console.log(err)
        }}

        async function createItem(){
            const{name, description, price} =formInput
            if(!name || !price || !description || !fileUrl) return
            const data = JSON.stringify({
                name, description, image: fileUrl
            })

            try {
                const added = await client.add(data)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                createSale(url)
            } catch (err) {
                console.log(err)
            }
        }

        async function createSale(url){
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()

            let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
            let transaction = await contract.createToken(url)
            let tx = await transaction.wait()

            let event = tx.events[0]
            let value = event.args[2]
            let tokenId = value.toNumber()

            const price = ethers.utils.parseUnits(formInput.price, 'ether')
            let marketContract = new ethers.Contract(nftmarketAddress, NFTMarket.abi, signer)
            let listingPrice = await marketContract.getListingPrice()
            listingPrice = listingPrice.toString()

            transaction = await marketContract.createMarketItem(nftAddress, tokenId, price,{value:listingPrice})

            await transaction.wait()
            Router.push('/')
        }

    return(
        <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input 
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />
          {
            fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} />
            )
          }
          <button onClick={createItem} className="font-bold mt-4 bg-sky-500 text-white rounded p-4 shadow-lg">
            Create NFT
          </button>
        </div>
      </div>
    
    )
}
