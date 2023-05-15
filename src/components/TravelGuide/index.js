import {Component} from 'react'

import './index.css'

import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class TravelGuide extends Component {
  state = {travelGuidePackagesData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.travelGuideInfo()
  }

  getFormattedData = packageData => ({
    id: packageData.id,
    name: packageData.name,
    imageUrl: packageData.image_url,
    description: packageData.description,
  })

  travelGuideInfo = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/tg/packages'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.packages.map(eachPackage =>
        this.getFormattedData(eachPackage),
      )
      this.setState({
        travelGuidePackagesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTravelGuideLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderTravelGuideSuccessView = () => {
    const {travelGuidePackagesData} = this.state
    return (
      <>
        <ul className="travel-guide-list-cont">
          {travelGuidePackagesData.map(eachPackage => (
            <li key={eachPackage.id} className="travel-guide-item">
              <img
                src={eachPackage.imageUrl}
                alt={eachPackage.name}
                className="package-image"
              />
              <div className="content-cont">
                <h1 className="package-title">{eachPackage.name}</h1>
                <p className="package-desc">{eachPackage.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderRespectiveTravelGuideView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTravelGuideSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderTravelGuideLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="travel-guide-cont">
        <h1 className="travel-guide-head">Travel Guide</h1>
        <div className="travel-guide-list-cont">
          {this.renderRespectiveTravelGuideView()}
        </div>
      </div>
    )
  }
}

export default TravelGuide
