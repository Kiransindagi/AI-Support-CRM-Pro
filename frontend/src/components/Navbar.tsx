import { Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl flex items-center">
        {/* Placeholder for global search if needed */}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
