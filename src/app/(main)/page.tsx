export const dynamic = 'force-dynamic';

import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import { getServerTokens } from '@/api/server-fetch';
import { fetchHome, EMPTY_HOME, type HomeResponse } from '@/api/home';
import { logger } from '@/lib/logger';
import HomeSections from '@/components/home/HomeSections';

async function loadSections(): Promise<HomeResponse> {
  const tokens = await getServerTokens();

  try {
    return await fetchHome(tokens);
  } catch (error) {
    logger.error({ err: error }, 'home: failed to load sections');
    return EMPTY_HOME;
  }
}

export default async function HomePage() {
  const data = await loadSections();

  return (
    <>
      <Header variant="center" />
      <MainContent>
        <HomeSections data={data} />
      </MainContent>
    </>
  );
}
