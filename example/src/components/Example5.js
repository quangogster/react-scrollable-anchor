import React, { Component } from 'react'
import ScrollableAnchor, { configureAnchors } from '../../../src'
import Section from './Section'

const sections = [
  {id: 'section1', label: 'Section 1', backgroundColor: 'red'},
  {id: 'section2', label: 'Section 2', backgroundColor: 'darkgray'},
  {id: 'section3', label: 'Section 3', backgroundColor: 'green'},
  {id: 'section4', label: 'Section 4', backgroundColor: 'brown'},
  {id: 'section5', label: 'Section 5', backgroundColor: 'lightpink'}
]

const styles = {
  offsetUp: {
    marginTop: '-549px'
  },
  extraTall: {
    height: '700px'
  },
  scrollingDiv: {
    height: '50vh',
    overflowY: 'scroll',
    marginTop: '25vh',
    width: '50%',
    marginLeft: '25%',
    position: 'relative'
  }

}

export default class Example5 extends Component {

  componentWillMount() {
    configureAnchors({containerId: 'scrolling-div'})
  }

  renderSection = (section) => {
    const props = {...section, sections, style: styles.extraTall}
    return (
      <div key={section.id}>
        <ScrollableAnchor id={section.id}>
          <Section {...props}/>
        </ScrollableAnchor>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.props.renderHeader(true, sections, true) }
        <div id='scrolling-div' style={styles.scrollingDiv}>
          { sections.map(this.renderSection) }
        </div>
      </div>
    )
  }
}
