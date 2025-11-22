import RegisterSuccess from "@/components/auth/RegisterSuccess";

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterSuccess email={email ?? "your email"} />
    </div>
  );
}
