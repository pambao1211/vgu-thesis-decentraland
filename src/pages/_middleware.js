import { NextResponse } from "next/server";
export const middleware = async (req, ev) => {
    const { pathname } = req.nextUrl;
    if (pathname === "/") {
        return NextResponse.redirect("/decentraland/lands/");
    }
    return NextResponse.next();
};
