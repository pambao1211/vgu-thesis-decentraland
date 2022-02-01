import { NextResponse } from "next/server";
export const middleware = async (req, ev) => {
    const { pathname } = req.nextUrl;
    if (pathname === "/citizens") {
        return NextResponse.redirect("/decentraland/citizens/overview");
    }
    return NextResponse.next();
};
