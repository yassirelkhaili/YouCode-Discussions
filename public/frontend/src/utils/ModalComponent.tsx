import React, {useEffect} from 'react'
import { ResponseProps } from '../pages/Register';
import Toast from './ToastComponent';

interface ModalProps {
    toast: React.ReactNode;
    settoast: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    contentType: string;
    message: string;
    id?: number; 
    type: 'danger' | 'success' | 'warning';
    updateFunction: () => void;
}


const Modal = ({message, type, id, toast, settoast, updateFunction, contentType} : ModalProps) => {
    let toastIcon: React.ReactNode | React.ReactElement;

    switch (type) {
        case 'danger':
            toastIcon = (<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
            </svg>
            <span className="sr-only">Error icon</span>
        </div>);
        break;
        case 'success':
        toastIcon = (<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span className="sr-only">Check icon</span>
    </div>);
        break;
        case 'warning':
            toastIcon = (<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
            </svg>
            <span className="sr-only">Warning icon</span>
        </div>);
        break;
        default:
            toastIcon = <></>;
        break;
    }

    const handleToastClose = (): void => {
        const toast = document.getElementById("toast") as HTMLDivElement;
        toast.classList.add("opacity-0");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 150);
    }
    

    const handleToastTrigger = (): void => {
        const toast = document.getElementById("toast") as HTMLDivElement;
        if (toast.classList.contains("flex")) {
            toast.classList.add("hidden");
            toast.classList.add("opacity-0");
            toast.classList.remove("flex");
            toast.classList.remove("translate-y-[-6rem]");
        }
        const triggerClasses: Array<string> = ['hidden', 'flex', 'opacity-0'];
        triggerClasses.forEach((triggerClass: string) => toast.classList.toggle(triggerClass));
        setTimeout(() => {
            toast.classList.add("opacity-1");
            toast.classList.add("translate-y-[-6rem]");
        }, 150);
    }

    useEffect(() => handleToastTrigger(), [toast])

    async function deleteWiki(): Promise<ResponseProps> {
        let endPoint: string = '';
        switch (contentType) {
            case 'wikis':
                endPoint = process.env.REACT_APP_HOST_NAME + `/deletewiki/${id}`;
            break;
            case 'categories':
                endPoint = process.env.REACT_APP_HOST_NAME + `/deletecategory/${id}`;
            break;
            default:
                endPoint = process.env.REACT_APP_HOST_NAME + `/deletewiki/${id}`;
            break;
        }
        try {
            const response: Response = await fetch(endPoint);
            if (!response.ok) {
                throw new Error(`Failed to delete wiki. Status: ${response.status}`);
            }
            const data: Promise<ResponseProps> = response.json();
            return data;
        } catch (error) {
            throw new Error(`There was an error fetching the data: ${error}`);
        }
    }

    const handleDelete = () => {
        deleteWiki().then((response: ResponseProps) => {
            updateFunction();
            switch(response.status) {
                case 'success':
                settoast(<Toast message={response.message} type='success'></Toast>);
                break;
                case 'insert':
                settoast(<Toast message={response.message} type='danger'></Toast>);
                break;
                default:
                settoast(<Toast message={response.message} type='warning'></Toast>);
                break;
               }
        }).catch((error) => console.error(error));
    }

  return (
    <>
    <div id="toast" className="flex-col gap-1 transform fixed right-8 bottom-[-6rem] transition ease-in-out opacity-0 hidden duration-150 items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-400 bg-gray-800" role="alert">
    <div className='flex w-full justify-between items-center gap-2'>
    {toastIcon}
    <div className="ms-3 text-sm font-normal">{message}</div>
    <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-600 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close" onClick={handleToastClose}>
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>
<div>
<button onClick={handleDelete} className="bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded focus:ring-4 focus:border-blue-200 border-blue-700">
      Confirm
    </button>
</div>
    </div>
    </>
  )
}

export default Modal