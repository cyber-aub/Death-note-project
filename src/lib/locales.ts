import { GetServerSideProps, GetStaticProps} from "next/types"

interface LoadLocales {
  host: string,
  locale: string
}
export async function loadLocales({ host, locale }: LoadLocales): Promise<JSON> {
  const res = await fetch(`${host}/locales/${locale}/common.json`)
  const data = await res.json()

  return data
}

export async function loadRulesLocales({ host, locale }: LoadLocales): Promise<JSON> {
  const res = await fetch(`${host}/locales/${locale}/rules.json`)
  const data = await res.json()
  return data
}




export const makeServerSideRender : GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}