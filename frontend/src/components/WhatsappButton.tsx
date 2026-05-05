export default function WhatsappButton() {
    const phone = "923314766611"; // replace with your actual WhatsApp number
    const message = "Hello, I'd like to inquire about your products.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  
    return (
      
        <a href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.469 2.018 7.77L0 32l8.454-2.217A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.27 22.098c-.344.967-2.016 1.847-2.762 1.963-.747.116-1.678.165-2.707-.166-.623-.2-1.423-.468-2.443-.916-4.29-1.854-7.09-6.17-7.304-6.455-.213-.284-1.74-2.31-1.74-4.407 0-2.098 1.1-3.13 1.49-3.553.39-.424.85-.53 1.133-.53.283 0 .567.003.814.014.261.012.611-.099.957.73.356.849 1.21 2.945 1.316 3.16.106.213.177.46.035.743-.141.283-.212.46-.424.707-.212.248-.447.554-.637.743-.212.213-.433.443-.186.868.248.425 1.1 1.813 2.363 2.934 1.623 1.447 2.994 1.896 3.42 2.108.424.213.672.178.92-.106.248-.284 1.063-1.24 1.347-1.664.284-.424.567-.354.956-.213.39.142 2.48 1.17 2.904 1.382.425.213.708.318.814.495.106.178.106 1.025-.237 1.993z" />
        </svg>
      </a>
    );
  }