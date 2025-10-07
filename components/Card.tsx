
import React, { forwardRef } from 'react';

interface CardProps {
  imageUrl: string;
  recipientName: string;
  wish: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ imageUrl, recipientName, wish }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full aspect-[3/4] max-w-[350px] bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col justify-between p-6 md:p-8 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center">
        <p className="text-2xl md:text-3xl font-dancing-script drop-shadow-md">Thân tặng,</p>
        <h2 className="text-3xl md:text-4xl font-bold font-dancing-script drop-shadow-lg mt-2">
          {recipientName}
        </h2>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-base md:text-lg drop-shadow-md whitespace-pre-wrap">
          {wish}
        </p>
      </div>

       <div className="relative z-10 text-center">
        <h3 className="text-4xl md:text-5xl font-bold font-dancing-script drop-shadow-lg text-rose-200">20/10</h3>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
