'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--page-bg) text-(--text-primary) px-4">
      <div className="
        w-full max-w-md 
        p-8 
        rounded-(--radius) 
        bg-(--surface) 
        border border-[rgba(0,0,0,0.04)] 
        dark:border-[rgba(255,255,255,0.05)]
      ">
        <h1 className="text-2xl font-semibold text-center mb-6 text-(--primary)">
          IlmoQuranbar Admin
        </h1>

        <form action={action} className="space-y-5">
          {/* USERNAME */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-(--muted)">
              Username
            </label>
            <Input  name="username"/>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-(--muted)">
              Password
            </label>
             <Input  name="password" type="password"/>
          </div>

          {/* SUBMIT */}
          <Button 
            type="submit"
            className="
              w-full 
              h-12 
              rounded-(--radius)
              bg-(--primary) 
              text-white 
              font-medium
              transition
              active:scale-[0.98]
            "
          >
            Login
          </Button>

          {/* ERROR */}
          {state?.error && (
            <p className="text-center text-sm text-red-500 mt-2">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
