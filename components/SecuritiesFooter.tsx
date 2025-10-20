'use client';

export default function SecuritiesFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 会社情報 */}
          <div>
            <h3 className="text-white font-bold mb-4">会社情報</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">会社概要</a></li>
              <li><a href="#" className="hover:text-white">IR情報</a></li>
              <li><a href="#" className="hover:text-white">採用情報</a></li>
              <li><a href="#" className="hover:text-white">プレスリリース</a></li>
            </ul>
          </div>

          {/* サービス */}
          <div>
            <h3 className="text-white font-bold mb-4">サービス</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">口座開設</a></li>
              <li><a href="#" className="hover:text-white">手数料</a></li>
              <li><a href="#" className="hover:text-white">キャンペーン</a></li>
              <li><a href="#" className="hover:text-white">セミナー情報</a></li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="text-white font-bold mb-4">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">よくあるご質問</a></li>
              <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white">各種資料請求</a></li>
              <li><a href="#" className="hover:text-white">操作マニュアル</a></li>
            </ul>
          </div>

          {/* 重要事項 */}
          <div>
            <h3 className="text-white font-bold mb-4">重要事項</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">金融商品取引法に基づく表示</a></li>
              <li><a href="#" className="hover:text-white">個人情報保護方針</a></li>
              <li><a href="#" className="hover:text-white">利用規約</a></li>
              <li><a href="#" className="hover:text-white">リスク・手数料等</a></li>
            </ul>
          </div>
        </div>

        {/* 免責事項 */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-xs text-gray-400">
          <p className="mb-4">
            【重要事項】株式等の金融商品取引においては、株価等の価格変動、金利変動、為替変動等により損失が生じるおそれがあります。
            また、信用取引等では、委託保証金や委託保証金率の額を上回る損失が発生する可能性があります。
          </p>
          <p className="mb-4">
            ※ このサイトはパスキー認証のデモンストレーション用です。実際の証券取引は行えません。
          </p>
          <div className="flex justify-between items-center">
            <p>© 2025 NextGen証券株式会社 Powered by Twilio Verify Passkey</p>
            <div className="flex gap-4">
              <span>金融商品取引業者 関東財務局長（金商）第0000号</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
