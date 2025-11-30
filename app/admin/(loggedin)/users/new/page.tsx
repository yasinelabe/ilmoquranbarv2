import UserForm from "../UserForm";

export default function NewUserPage() {
  return (
    <div className="ml-64 p-8">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <UserForm />
    </div>
  );
}