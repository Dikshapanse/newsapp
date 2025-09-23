import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalzeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateNews = async () => {
    props.setProgress(10)
    const { country, category, pageSize } = props

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=d1b794de7a474a35ad7c12fe7e3220c7&page=${page}&pageSize=${pageSize}`
     
    setLoading(true)
    let data = await fetch(url)
    let parsedData = await data.json()
    props.setProgress(70)

    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalzeFirstLetter(props.category)} - Quick_News`
    updateNews()
    // eslint-disable-next-line
  }, [])

  const fetchMoreData = async () => {
    const { country, category, pageSize } = props
    let nextPage = page + 1
    setPage(nextPage)

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=d1b794de7a474a35ad7c12fe7e3220c7&page=${nextPage}&pageSize=${pageSize}`
    
    let data = await fetch(url)
    let parsedData = await data.json()

    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  }

  return (
    <>
      <h1 className='text-center' style={{ margin: '70px 0px 20px 0px' }}>
        Quick_News - Top {capitalzeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner/>}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={(element.title || "No Title").slice(0, 40)}
                    description={(element.description || "No Description Available").slice(0, 88)}
                    imageUrl={element.urlToImage 
                      ? element.urlToImage 
                      : "https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg"}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name} 
                  />
                </div>
              )
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

News.defaultProps = {
  country: 'us',
  pageSize: 10,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
