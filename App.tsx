
import React, { useState, useRef, useCallback } from 'react';
import { generateCardImage } from './services/geminiService';
import Card from './components/Card';
import LoadingSpinner from './components/LoadingSpinner';

// Let TypeScript know that htmlToImage is available globally from the script tag in index.html
declare const htmlToImage: {
  toPng: (node: HTMLElement, options?: any) => Promise<string>;
};

const SUGGESTED_WISHES = [
  "Chúc bạn một ngày 20/10 thật nhiều niềm vui, hạnh phúc và luôn xinh đẹp. Mãi yêu!",
  "Nhân ngày Phụ nữ Việt Nam, chúc bạn luôn là bông hoa xinh đẹp nhất trong vườn hoa ngát hương. Luôn tỏa sáng nhé!",
  "Gửi đến bạn những lời chúc tốt đẹp nhất. Chúc bạn có một ngày 20/10 thật ý nghĩa, trọn vẹn và đong đầy yêu thương.",
  "Happy Vietnamese Women's Day! Chúc bạn luôn mạnh khỏe, thành công và giữ mãi nụ cười trên môi.",
];

const App: React.FC = () => {
  const [recipientName, setRecipientName] = useState<string>('Người Phụ Nữ Tuyệt Vời');
  const [wish, setWish] = useState<string>(SUGGESTED_WISHES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerateCard = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateCardImage();
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError('Không thể tạo hình ảnh. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCard = useCallback(() => {
    if (!cardRef.current) return;

    htmlToImage.toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // Increase resolution for better quality
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'thiep-chuc-mung-20-10.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        setError('Không thể tải thiệp. Vui lòng thử lại.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-amber-100 w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-rose-600 font-dancing-script">Tạo Thiệp 20/10</h1>
          <p className="text-gray-600 mt-2 text-lg">Gửi lời chúc yêu thương đến những người phụ nữ tuyệt vời</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form section */}
          <div className="flex flex-col space-y-6">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
              <input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="VD: Mẹ, Chị Gái, Em Yêu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>
            <div>
              <label htmlFor="wish" className="block text-sm font-medium text-gray-700 mb-1">Lời chúc của bạn</label>
              <textarea
                id="wish"
                rows={5}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Nhập lời chúc của bạn tại đây..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
              ></textarea>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Hoặc chọn lời chúc có sẵn:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_WISHES.map((suggestedWish, index) => (
                  <button
                    key={index}
                    onClick={() => setWish(suggestedWish)}
                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs hover:bg-rose-200 transition"
                  >
                    Gợi ý {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerateCard}
              disabled={isLoading}
              className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading && <LoadingSpinner />}
              <span>{isLoading ? 'Đang tạo hình nền...' : 'Tạo Thiệp Với AI'}</span>
            </button>
          </div>

          {/* Card preview section */}
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[300px] lg:min-h-[400px]">
            {isLoading && (
              <div className="text-center text-gray-600">
                <LoadingSpinner large={true} />
                <p className="mt-4">AI đang vẽ một bức tranh thật đẹp...</p>
                 <p className="text-sm text-gray-500">Quá trình này có thể mất một chút thời gian.</p>
              </div>
            )}
            {!isLoading && error && <p className="text-red-500">{error}</p>}
            {!isLoading && !generatedImage && (
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Thiệp của bạn sẽ xuất hiện ở đây.</p>
              </div>
            )}
            {generatedImage && (
              <div className="w-full flex flex-col items-center">
                <Card
                  ref={cardRef}
                  imageUrl={generatedImage}
                  recipientName={recipientName}
                  wish={wish}
                />
                <button
                  onClick={handleDownloadCard}
                  className="mt-4 bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Tải Thiệp</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
       <footer className="text-center mt-6 text-gray-500 text-sm">
          <p>Tạo bởi Gemini API & React</p>
      </footer>
    </div>
  );
};

export default App;
