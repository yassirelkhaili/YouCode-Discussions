import React, {useEffect, useState} from 'react'

interface Wiki {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
    tags: string;
  }
  
  interface ResponseProps {
    status: string;
    message: string;
    content?: Array<Wiki>;
  }
  
  interface CategoryResponseProps {
    status: string;
    message: string;
    content?: Array<Category>;
  }
  
  interface Category {
    id: string;
    name: string;
    description: string;
  }

const Header = () => {
    const [searchCategory, setsearchCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [wikis, setwikis] = useState<Array<Wiki>>();
    const [categories, setcategories] = useState<Array<Category>>();

    const fetchCategories = async(): Promise<CategoryResponseProps> => {
      const endpoint: string = process.env.REACT_APP_HOST_NAME + '/fetchcategories';
  const options: {
    method: string;
    credentials: RequestCredentials;
} = {
    method: 'GET',
    credentials: 'include',
};
      try {
        const response: Response = await fetch (endpoint, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CategoryResponseProps = await response.json();
        return data;
      } catch (error) {
        throw new Error ("An Error has occured: " + error);
      }
    }

    const fetchWikis = async(): Promise<ResponseProps> => {
      const endpoint: string = process.env.REACT_APP_HOST_NAME + '/fetchwikisadmin';
  const options: {
    method: string;
    credentials: RequestCredentials;
} = {
    method: 'GET',
    credentials: 'include',
};
      try {
        const response: Response = await fetch (endpoint, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ResponseProps = await response.json();
        return data;
      } catch (error) {
        throw new Error ("An Error has occured: " + error);
      }
    }

  const toggleCategories = () => {
    const dropdownMenu = document.getElementById("dropdown") as HTMLUListElement;
    dropdownMenu && dropdownMenu.classList.toggle('hidden');
  };

  const updateWikis = (): void => {
    fetchWikis().then((response: ResponseProps) => {
        setwikis(response.content);
    }).catch((error) => console.error(`An error has occured ${error}`));
  }

  useEffect(() => {
    fetchWikis().then((response: ResponseProps) => {
        setwikis(response.content);
        console.log(response.message);
    }).catch((error) => console.error(`An error has occured ${error}`));
    fetchCategories().then((response: CategoryResponseProps) => {
        setcategories(response.content);
    }).catch((error) => console.error(`An error has occured ${error}`));
  }, [])

    const displaySearchResults = (): void => {
        const searchDropDown = document.getElementById("search-result") as HTMLDivElement;
        const categoriesBtn = document.getElementById('dropdown-button') as HTMLDivElement;
        const dropdownMenu = document.getElementById("dropdown") as HTMLUListElement;
        searchDropDown && searchDropDown.classList.toggle('hidden');
        if (categoriesBtn && !dropdownMenu.classList.contains('hidden')) {
          !categoriesBtn.classList.contains('hidden') && toggleCategories();
        }
      }
    
      const removeSearchResult = (event: React.FocusEvent<HTMLInputElement>): void => {
        const searchDropDown = document.getElementById("search-result") as HTMLDivElement;
        const isChildElement = event.relatedTarget && event.currentTarget.contains(event.relatedTarget);
        if (!isChildElement) {
          (searchDropDown && !searchDropDown.classList.contains("hidden")) && searchDropDown.classList.add('hidden');
        }
      }
    
      const filteredWikis = wikis
      ? wikis.filter((wiki: Wiki) => {
          const isCategoryMatch: boolean = searchCategory === '' ? true : searchCategory === wiki.category;
          const isNameMatch: boolean = wiki.title.toLowerCase().includes(searchQuery.toLowerCase());
          const tagsArray: Array<string> = wiki.tags.split(',');
          const isTagMatch: boolean = tagsArray.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          return isCategoryMatch && (isNameMatch || isTagMatch);
        })
      : [];
    
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    const setSearchCategory = (searchCategory: string): void => {
        setsearchCategory(searchCategory);
        toggleCategories();
        //change category button label
        const dropdownBtn = document.getElementById("dropdown-button-text") as HTMLSpanElement;
        dropdownBtn.textContent = searchCategory === '' ? 'All categories' : searchCategory;
      }
  return (
    <>
    <section>
    <div className="w-full flex justify-end items-center gap-4">
    <div className="flex w-[100%] relative">
        <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
        <button onClick={toggleCategories} id="dropdown-button" data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button"><span id="dropdown-button-text">All categories</span> <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
  </svg></button>
        <div className="absolute z-10 top-[3rem] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul id="dropdown" className="hidden py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
            <li onClick={() => setSearchCategory('')}>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All categories</button>
            </li>
            {categories && categories.map((category: Category, index: number) => {
              return (
                <li key={index} onClick={() => setSearchCategory(category.name)}>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{category.name}</button>
            </li>
              )
            })}
            </ul>
        </div>
        <div className="relative w-full" onBlur={removeSearchResult}>
            <input type="search" id="search-dropdown" className="outline-none block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search for Wikis..." required onFocus={displaySearchResults} onChange={handleSearchInput}></input>
            <div id="search-result" className="hidden absolute z-10 top-[3rem] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 py-2">
            {filteredWikis.length > 0 ? (
              filteredWikis.slice(0, 5).map((wiki: Wiki, index: number) => (
                <a
                  key={index} 
                  className="inline-flex w-full px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" 
                  href={`${process.env.REACT_APP_HOST_NAME}/wiki/${wiki.id}`}
                >
                  <div className="flex flex-col">
                  <div className="block">{wiki.title}</div>
                  <div className="text-gray-400">{wiki.content.length > 30 ? wiki.content.slice(0, 30) + '...' : wiki.content}</div>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-bold inline-flex w-full px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">No results found</div>
            )}
            </div>
        </div>
    </div>
       <button className="flex gap-1 jutify-center items-center bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded focus:ring-4 focus:border-blue-200 border-blue-700" onClick={updateWikis}>
Refresh
<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/></svg>
      </button>
       </div>
    </section>
    </>
  )
}

export default Header