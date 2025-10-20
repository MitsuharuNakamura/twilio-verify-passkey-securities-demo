'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeAccess() {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // クライアントサイドでのみURLを取得
    setCurrentUrl(window.location.origin);
  }, []);

  if (!currentUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          スマホでアクセス
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          QRコードを読み取って、お持ちのスマートフォンでパスキー体験
        </p>
        <div className="bg-white p-4 inline-block rounded-lg border-2 border-gray-200">
          <QRCodeSVG
            value={currentUrl}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {currentUrl}
        </p>
      </div>
    </div>
  );
}
