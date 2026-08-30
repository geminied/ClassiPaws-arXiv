import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(
  request: Request
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const q =
      searchParams.get("q") || "";

    const targetClass =
      searchParams.get(
        "target_class"
      ) || "";

    const limit =
      searchParams.get(
        "limit"
      ) || "20";

    const params =
      new URLSearchParams();

    if (q) {
      params.set("q", q);
    }

    if (targetClass) {
      params.set(
        "target_class",
        targetClass
      );
    }

    params.set(
      "limit",
      limit
    );

    const response =
      await fetch(
        `http://127.0.0.1:8000/papers?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

    if (!response.ok) {

      return NextResponse.json(
        {
          error:
            "Failed to load papers",
        },
        {
          status:
            response.status,
        }
      );
    }

    const data =
      await response.json();

    return NextResponse.json(
      data.papers || []
    );

  } catch (error) {

    console.error(
      "Papers API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not connect to backend",
      },
      {
        status: 500,
      }
    );
  }
}