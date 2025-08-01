'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAppContext } from '../../../context/AppContext';

export default function ProductGallery({ images, main }) {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const { state = {}, dispatch = () => {} } = useAppContext() || {};

    const isYouTubeLink = (url) => /youtube\.com|youtu\.be/.test(url);
    const isVideoFile = (url) => url.endsWith('.mp4') || url.includes('.mp4');
    const getYouTubeId = (url) => {
        const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const openModal = (index) => {
        setActiveIndex(index);
        setIsModalOpen(true);
    };

    const renderThumbnail = (img, index) => {
        const isYouTube = isYouTubeLink(img);
        const isVideo = isVideoFile(img);
        const youtubeId = getYouTubeId(img);

        return (
            <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-md p-1 ${selectedImage === img ? 'border-red-500' : 'border-transparent'}`}
            >
                <span className='relative block'>
                    {(isYouTube || isVideo) && (
                        <i className="icon-circle-play-regular player-icon absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl"></i>
                    )}
                    <img
                        src={
                            isYouTube && youtubeId
                                ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                                : isVideo
                                    ? main
                                    : img
                        }
                        alt={`Thumbnail ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                    />
                </span>
            </button>
        );
    };

    const renderMainContent = () => {
        const isYouTube = isYouTubeLink(selectedImage);
        const isVideo = isVideoFile(selectedImage);
        const youtubeId = getYouTubeId(selectedImage);

        let content;

        if (isYouTube && youtubeId) {
            content = (
                <iframe
                    className="w-full h-full aspect-video"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        } else if (isVideo) {
            content = (
                <video
                    controls
                    className="w-full max-h-[500px] w-auto max-w-full rounded object-contain"
                >
                    <source src={selectedImage} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            content = (
                <img
                    src={selectedImage}
                    alt="Selected product"
                    className="max-h-[500px] w-auto max-w-full object-contain rounded"
                />
            );
        }

        const selectedIndex = images.indexOf(selectedImage);

        return (
            <div className="relative group w-full max-w-full overflow-hidden">
                <div className="w-full max-h-[500px] aspect-video flex items-center justify-center">
                    {content}
                </div>

                {/* Expand icon opens swiper modal */}
                <button
                    onClick={() => openModal(selectedIndex)}
                    className={`absolute top-2 ${state.LANG === 'EN' ? 'left-2' : 'left-2'} z-10 text-white bg-black/50 p-2 rounded-full flex items-center justify-center cursor-pointer`}
                >
                    <i className="icon-expand-solid text-xl"></i>
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-start gap-4 products-gallery">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-2 flex-wrap md:flex-nowrap thumbnails">
                    {images.map((img, index) => renderThumbnail(img, index))}
                </div>

                {/* Main Display */}
                <div className="flex-1 main-image w-full">
                    {renderMainContent()}
                </div>
            </div>

            {/* Modal with Swiper */}
            {isModalOpen && (
                <div
                    className="product-gallery-modal fixed inset-0 bg-black/90 z-[999999999] flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)} // close on backdrop click
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-white text-3xl z-[1010] cursor-pointer"
                    >
                        ×
                    </button>
                    {/* Prevent click from bubbling to backdrop */}
                    <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl">
                        {/* Close Button */}

                        <Swiper
                            initialSlide={activeIndex}
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="w-full"
                        >
                            {images.map((img, index) => {
                                const isYouTube = isYouTubeLink(img);
                                const isVideo = isVideoFile(img);
                                const youtubeId = getYouTubeId(img);

                                return (
                                    <SwiperSlide key={index}>
                                        <div className="w-full aspect-video flex items-center justify-center">
                                            {isYouTube && youtubeId ? (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : isVideo ? (
                                                <video controls className="max-h-[80vh] w-auto max-w-full object-contain rounded">
                                                    <source src={img} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={img}
                                                    alt={`Slide ${index + 1}`}
                                                    className="max-h-[80vh] w-auto max-w-full object-contain rounded"
                                                />
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            )}

        </>
    );
}
