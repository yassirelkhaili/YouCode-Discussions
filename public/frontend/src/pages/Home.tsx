import React, {useEffect, useState} from "react"
import Spinner from "../utils/Spinner";

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

const Home = () => {
  const [wikis, setwikis] = useState<Array<Wiki>>();
    const [isLoading, setisLoading] = useState<boolean>(false);
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
    setisLoading(true);
    fetchWikis().then((response: ResponseProps) => {
        setwikis(response.content);
    }).catch((error) => console.error(`An error has occured ${error}`)).finally(() => setisLoading(false));
  }

  useEffect(() => {
    setisLoading(true);
    fetchWikis().then((response: ResponseProps) => {
        setwikis(response.content);
        console.log(response.message);
    }).catch((error) => console.error(`An error has occured ${error}`)).finally(() => setisLoading(false));
    fetchCategories().then((response: CategoryResponseProps) => {
        setcategories(response.content);
    }).catch((error) => console.error(`An error has occured ${error}`));
  }, [])



  return (
    <>
    <section className="bg-gray-900 grid grid-cols-12 m:pl-0 mx-auto m:mx-lg l:m-auto xl:m-auto l:max-w-[1352px] xl:max-w-[1524px]">
      <aside className="top-[4rem] left-[2rem] col-span-2 hover:overflow-y-auto ">
      <div className="overflow-y-auto flex flex-col divide-y">
      <h1>hello</h1>
      </div>
      </aside>
      <div className="overflow-y-auto bg-gray-900 col-span-6 mx-auto sm:mx-8 2xl:mx-28 pt-8">
      {(isLoading) ? <Spinner/> : wikis && wikis.map((wiki: Wiki, index: number) => {
    return (
      <div key={index}>
      <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-2xl tracking-tight font-bold text-white dark:text-white">{wiki.title}</h2>
          <p className="lead text-gray-500 text-[1.1rem] mb-4">{wiki.content.slice(0, 285)}</p>
          <div className="flex justify-center items-start gap-2 flex-col">
          <p className="text-gray-500">tags:</p>
         <div className="flex flex-wrap gap-1">
         {wikis[index].tags && wikis[index].tags.split(',').map((tag: string, index: number) => {
                        return (
                          <div 
                          key={index} 
                          className='dark:bg-primary-900 flex py-1 rounded gap-1 px-2 text-primary-300'
                        >
                          <span className="text-xs font-medium text-primary-300">{tag}</span>
                        </div>                        
                        )
          })}
         </div>
          <a href={`${process.env.REACT_APP_HOST_NAME}/wiki/${wiki.id}`} className="flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
              Read Thread
              <svg className="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </a>
          </div>
      </div>
  </div>
    )
  })}
      </div>
    <aside className="top-[4rem] right-[2rem] hidden lg:mr-4 lg:flex col-span-4 flex-col gap-2 justify-center items-end">
       <div className="p-4 pt-8 max-w-[20rem] rounded-lg bg-card_background_color w-full">
        <h2 className="mb-6 text-2xl tracking-tight font-bold text-[#3B82F6]">Latest Threads</h2>
  {(isLoading) ? <Spinner/> : wikis && wikis.slice(0, 5).map((wiki: Wiki, index: number) => {
    return (
      <div key={index}>
      <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-2xl tracking-tight font-bold text-white dark:text-white">{wiki.title}</h2>
          <p className="lead text-gray-500 text-[1.1rem] mb-4">{wiki.content.slice(0, 285)}</p>
          <div className="flex justify-center items-start gap-2 flex-col">
         <div className="flex flex-wrap gap-1">
         {wikis[index].tags && wikis[index].tags.split(',').map((tag: string, index: number) => {
                        return (
                          <div 
                          key={index} 
                          className='dark:bg-primary-900 flex py-1 rounded gap-1 px-2 text-primary-300'
                        >
                          <span className="text-xs font-medium text-primary-300">{tag}</span>
                        </div>                        
                        )
          })}
         </div>
          <a href={`${process.env.REACT_APP_HOST_NAME}/wiki/${wiki.id}`} className="flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
              Read Thread
              <svg className="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </a>
          </div>
      </div>
  </div>
    )
  })}
  </div>
  <div className="p-4 max-w-[20rem] rounded-lg bg-card_background_color">
        <h2 className="mb-6 text-2xl tracking-tight font-bold text-[#3B82F6]">Latest Topics</h2>
        <div className="flex justify-center items-start gap-4 flex-col">
  {(isLoading) ? <Spinner/> : categories && categories.slice(0, 5).map((category: Category, index: number) => {
    return (
      <div key={index}>
      <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-2xl tracking-tight font-bold text-white dark:text-white">{category.name}</h2>
          <p className="lead text-gray-500 text-[1.1rem]">{category.description.slice(0, 285)}</p>
          </div>
      </div>
    )
  })}
  </div>
  </div>
</aside>
    </section>
    </>
  )
}

export default Home