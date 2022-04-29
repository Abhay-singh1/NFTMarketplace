import {ethers} from 'ethers'
import { useEffect, useState } from 'react';
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    nftAddress,
    nftmarketAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/Nft.json'
import NFTMarket from '../artifacts/contracts/NFTMarketplace.sol/NFTMarket.json'

export default function Home(){

    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() =>{
        loadNfts()
    }, [])

    async function loadNfts(){
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftmarketAddress, NFTMarket.abi, provider)
        const data = await marketContract.fetchMyNfts()
        
        const items = await Promise.all(data.map(async i =>{
            const tokenuri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenuri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item ={
                price,
                tokenId: i.tokenId.toNumber(),
                seller:i.seller,
                owner:i.owner,
                image:meta.data.image,
                name:meta.data.name,
                description:meta.data.description
            }
            return(item)
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    if(loadingState ==='loaded' && !nfts.length){
        return(
            <h1 className='px-20 py-10 text-3xl'> No NFTs bought yet</h1>
        )
    }

    return(
        <div className='flex justify-center'>
            <div className='px-4' style={{maxWidth:'1600px'}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-sky-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
            </div>

        </div>
    )
}