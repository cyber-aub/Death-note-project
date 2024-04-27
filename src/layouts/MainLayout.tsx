import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConfigProvider, Layout } from "antd";
// import theme from '@/theme/ThemeConfig';
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from 'react-redux'
import { store } from "@/stores/store";
import { useAppSelector } from "@/stores/hooks";
import { selectThemeMode } from "@/stores/settings/selectors";
import { getTheme } from "@/theme/ThemeConfig";

function AppContainer({ children }: { children: ReactNode }) {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)
    return (
        <ConfigProvider theme={theme}>
            <Layout style={{padding:0}}>
                <Layout.Content style={{padding:0}} className="h-screen w-screen flex  flex-col items-center justify-center overflow-y-scroll">
                    {children}
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    )
}

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <Provider store={store} >
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                <ConvexClientProvider>
                    <AppContainer>
                        {children}
                    </AppContainer>
                </ConvexClientProvider>
            </ClerkProvider>
        </Provider>

    )
}