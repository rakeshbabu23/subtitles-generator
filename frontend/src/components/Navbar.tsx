import { FC } from "react";
import { Loader, Subtitles } from "lucide-react";
const Navbar: FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Subtitles className="w-6 h-6 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Subtitles AI
            </h1>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
