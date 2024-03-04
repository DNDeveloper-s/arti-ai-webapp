import { carouselImage1, carouselImage2 } from '@/assets/images/carousel-images';
import Image from 'next/image';
import React from 'react';
import { MdModeEdit } from 'react-icons/md';

interface MetricsCardProps {

}
export default function MetricsCard(props: MetricsCardProps) {

    return (
        <div className=''>
            <div className='flex bg-gray-900 border-2 border-gray-800 py-4 px-6 rounded-lg'>
                <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>ARTI AI - Free Week - Lead Form Campaign</h3>
                    <div className='flex flex-col gap-4 my-3'>
                        <div className='pl-6'>
                            <h4>Ad Set One</h4>
                            <div className='flex items-center gap-2 mt-2 pl-6'>
                                <div className='w-10 h-10 border border-gray-600 rounded overflow-hidden'>
                                    <Image className='w-full h-full object-cover rounded' width={20} height={20} src={carouselImage1} alt="Arti AI welcomes you"/>
                                </div>
                                <div className='w-10 h-10 border border-gray-600 rounded overflow-hidden'>
                                    <Image className='w-full h-full object-cover rounded' width={20} height={20} src={carouselImage2} alt="Arti AI welcomes you"/>
                                </div>
                            </div>
                        </div>
                        <div className='pl-6'>
                            <h4>Ad Set Two</h4>
                            <div className='flex items-center gap-2 mt-2 pl-6'>
                                <div className='w-10 h-10 border border-gray-600 rounded overflow-hidden'>
                                    <Image className='w-full h-full object-cover rounded' width={20} height={20} src={carouselImage1} alt="Arti AI welcomes you"/>
                                </div>
                                <div className='w-10 h-10 border border-gray-600 rounded overflow-hidden'>
                                    <Image className='w-full h-full object-cover rounded' width={20} height={20} src={carouselImage2} alt="Arti AI welcomes you"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between items-end'>
                    <div className="flex gap-8 flex-1">
                        <div className='flex flex-col gap-1'>
                            <div>
                                <span className='text-gray-500 text-sm'>Delivery</span>
                            </div>
                            <div>
                                <span className='text-primary text-lg'>Active</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div>
                                <span className='text-gray-500 text-sm'>Impressions</span>
                            </div>
                            <div>
                                <span className='text-primary text-lg'>2450</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div>
                                <span className='text-gray-500 text-sm'>Spends</span>
                            </div>
                            <div>
                                <span className='text-primary text-lg'>$2535+</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='flex py-1 px-3 gap-1 bg-gray-800 hover:bg-gray-900 transition-all rounded border border-gray-700 cursor-pointer items-center'>
                            <div className='text-base'>
                                <MdModeEdit />
                            </div>
                            <span className='text-sm'>Edit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}