import { GetServerSideProps } from "next/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";


export const serverLoadPlayerProfile : GetServerSideProps = async () => {

    const client = new ConvexHttpClient(process.env.CONVEX_URL!);

    const playerProfile = await client.query(api.player.loadPlayerProfile);

    return {
        props: {
            playerProfile
        }
    }
}