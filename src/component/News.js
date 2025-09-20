import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes, { string } from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
 
export class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize : 10,
    category : 'general'
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,
  }

  capitalzeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalzeFirstLetter(this.props.category)} - Quick_News`;
  }

  async updateNews() {
    this.props.setProgress(10);

    const { country, category, pageSize } = this.props;
    const { page } = this.state;

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=d1b794de7a474a35ad7c12fe7e3220c7&page=${page}&pageSize=${pageSize}`;
    
    this.setState({ loading: true });

    this.props.setProgress(10);

    let data = await fetch(url);
    let parsedData = await data.json();
    this.props.setProgress(70);

    this.setState({ 
      articles: parsedData.articles, 
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);

  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    const { country, category, pageSize } = this.props;
    const { page } = this.state;

    this.setState({page: this.state.page + 1});
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=d1b794de7a474a35ad7c12fe7e3220c7&page=${page}&pageSize=${pageSize}`;
    
    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({ 
      articles: this.state.articles.concat(parsedData.articles), 
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    return (
      <>
        <h1 className='text-center' style={{ margin: '20px 0px' }}>
          Quick_News - Top {this.capitalzeFirstLetter(this.props.category)} Headlines
        </h1>

        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length != this.state.totalResults}
          loader={<Spinner/>}>

          <div className="container">

          <div className="row">
            {this.state.articles.map((element) => {
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
                    source = {element.source.name} 
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
}

export default News
