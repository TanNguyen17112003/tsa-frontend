import { useRouter } from 'next/router';
import type { Page as PageType } from 'src/types/page';

const Page: PageType = () => {
  const router = useRouter();
  router.replace('/landing');
  return <></>;
};

export default Page;
