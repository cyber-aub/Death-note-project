import { useConvexAuth } from "convex/react";
import { ReactElement } from "react";


interface StateLoaderProps {
    injector: ReactElement
}
export default function StateLoader({ injector }: StateLoaderProps) {
    const { isAuthenticated } = useConvexAuth();
    return (
            isAuthenticated? injector :null
    )

}