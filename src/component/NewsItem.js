import React, { Component } from 'react'

export class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, author, date } = this.props;
    return (
      <>      
        <div className='my-3'>
          <div className="card">
            <img style={{ width: '355px', height: '250px' }}
              src={imageUrl || "/noimage.png"} 
              onError={(e) => { e.target.src = "/noimage.png"; }} 
              className='card-img-top' 
              alt="news"
            />
            <div className="card-body">
              <h5 className="card-title">{title}...<span className="position-absolute top-0 start-100 translate-middle p-2 bg-info border border-light rounded-circle">
    <span className="visually-hidden">New alerts</span>
  </span>
</h5>
              <p className="card-text">{description}...</p>
              <p className="card-text">
                <small 
                  className="text-body-secondary" 
                  style={{color: '#09a1bf'}}>
                  By {author ?  author : "Unkonwn"} on {new Date(date).toGMTString()}
                </small>
              </p>
              <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark"> Rea More
              </a>
            </div>
          </div>
        </div> 
      </>
    )
  }
}

export default NewsItem
