import { NextResponse } from "next/server";
export const middleware = async (req, ev) => {
    const { pathname } = req.nextUrl;
    if (pathname === "/lands") {
        return NextResponse.redirect("/decentraland/lands/overview");
    }
    return NextResponse.next();
};
