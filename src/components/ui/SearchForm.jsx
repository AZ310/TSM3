import React from 'react';
import { Search, Calendar, Users } from 'lucide-react';

const SearchForm = ({ onSubmit }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Where do you want to go?"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              name="passengers"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Search Tickets</span>
        </button>
      </form>
    </div>
  );
};

export default SearchForm;