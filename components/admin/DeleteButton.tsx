'use client'

import { useFormStatus } from 'react-dom';
import { Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// 1. The actual button that sits inside the form
function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  );
}

// 2. The Wrapper Component
interface DeleteButtonProps {
  action: (formData: FormData) => Promise<any>;
  itemId: number | string;
}
export function DeleteButton({ action, itemId }: DeleteButtonProps) {
  // We wrap the server action to handle the toast feedback client-side
  const handleSubmit = async (formData: FormData) => {
    // Append ID if not passed via bind, though usually we assume action is pre-bound
    const result = await action(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" value={itemId} />
      <DeleteSubmitButton />
    </form>
  );
}