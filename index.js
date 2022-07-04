import express from "express";
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config();


const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
const stringDate = `${year}-${month}-${day}`
const apiKey = process.env.API_KEY;

const homePageUrl = `https://newsapi.org/v2/everything?sources=bbc-news&from=${stringDate}&sortBy=popularity&apiKey=${apiKey}`
const topHeadlinesUrl = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`


const app = express();

app.set("view engine", "ejs");


app.get("/", async (req, res) => {

    try {
        const everything = await axios.get(homePageUrl);
        const topHeadlines = await axios.get(topHeadlinesUrl);
        res.render(
            "home",
            {
                articles: everything.data.articles.slice(0, 30),
                mainArticle: topHeadlines.data.articles[0],
                topArticles: topHeadlines.data.articles.slice(1),
                headerTitle: "HOME",
                title: "LATEST",
                year: year
            }
        );
    } catch (error) {
        res.render(
            "errorPage",
            {
                statusCode: 500,
                errorMessage: "internal server error"
            }
        )
    }

})


app.get("/categories/:name", async (req, res) => {
    const categoryName = req.params.name;
    const url = `https://newsapi.org/v2/everything?q=${categoryName}&sources=bbc-news&sortBy=popularity&apiKey=${apiKey}`

    try {
        const categoryNews = await axios.get(url);
        res.render(
            "subSection",
            {
                articles: categoryNews.data.articles.slice(0, 30),
                title: categoryName.toUpperCase(),
                headerTitle: categoryName.toUpperCase(),
                year: year
            }
        )
    } catch (error) {
        res.render(
            "errorPage",
            {
                statusCode: 500,
                errorMessage: "internal server error"
            }
        )
    }
});


app.get("/search", async (req, res) => {
    const queryParam = req.query.q;
    const url = `https://newsapi.org/v2/everything?q=${queryParam}&sources=bbc-news&sortBy=popularity&apiKey=${apiKey}`
    try {
        const searchNews = await axios.get(url);
        res.render(
            "subSection",
            {
                articles: searchNews.data.articles.slice(0, 30),
                title: "Search results for " + queryParam.toUpperCase(),
                headerTitle: "SEARCH",
                year: year
            }
        )
    } catch (error) {
        res.render(
            "errorPage",
            {
                statusCode: 500,
                errorMessage: "internal server error"
            }
        )
    }
})


app.get("/*", (req, res) => {
    res.render(
        "errorPage",
        {
            statusCode: 404,
            errorMessage: "page not found"
        }
    )
})

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log("Server running at port " + `${PORT}`);
});