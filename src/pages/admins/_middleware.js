import { NextResponse } from "next/server";
export const middleware = async (req, ev) => {
    const { pathname } = req.nextUrl;
    if (pathname === "/admins") {
        return NextResponse.redirect("/decentraland/admins/overview");
    }
    return NextResponse.next();
};
