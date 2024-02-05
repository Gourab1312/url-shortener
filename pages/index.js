import Head from "next/head";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home({ urlList }) {
  const [data, setData] = useState(urlList);
  const [newUrl, setNewUrl] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const content = await response.json();
      setData([content, ...data]);
      setNewUrl("");
    } catch (error) {
      console.error("Error:", error);
      // Add error handling or user feedback (e.g., set an error state)
    }
  };

  return (
    <>
      <Head>
        <title>Url-Shortener</title>
      </Head>
      <main className="content">
        <div className="container">
          <h2 className="mb-3">URL-Shortener</h2>
          <form className="mb-3" onSubmit={handleOnSubmit}>
            <input
              type="text"
              className="w-75"
              placeholder="Enter long url..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button type="submit" className="btn btn-dark mx-2">
              Create Short Url
            </button>
          </form>

          <div className="table-responsive custom-table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">Long URL</th>
                  <th scope="col">Short URL</th>
                  <th scope="col">Clicked</th>
                </tr>
              </thead>
              <tbody>
                {data.map((urlObject) => (
                  <React.Fragment key={urlObject.code}>
                    <tr scope="row">
                      <td>
                        <a href={urlObject.url}>
                          {urlObject.url.length > 120
                            ? `${urlObject.url.slice(0, 120)}...`
                            : urlObject.url}
                        </a>
                      </td>
                      <td>
                        <a target="_blank" href={`/api/${urlObject.code}`}>
                          {urlObject.code}
                        </a>
                      </td>
                      <td>{urlObject.clicked}</td>
                    </tr>
                    <tr className="spacer" key={`${urlObject.code}-spacer`}>
                      <td colSpan="100"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/url");
    if (!res.ok) {
      throw new Error("Failed to fetch URL list");
    }

    const urlList = await res.json();

    return {
      props: {
        urlList,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    // Handle fetch error or set an error state
    return {
      props: {
        urlList: [],
      },
    };
  }
}
