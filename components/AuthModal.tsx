'use client';

interface AuthModalProps {
  isOpen: boolean;
  message: string;
}

export default function AuthModal({ isOpen, message }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          認証中...
        </h3>
        <p className="text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}
