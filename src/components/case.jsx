import React, { Component } from 'react';
import idx from 'idx';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import NavTop from './nav-top';
import NavBottom from '../containers/nav_bottom_container';
import CasePanel from './case/index';
import FhirExplorer from '../containers/fhir_explorer_container';

class Case extends Component {
  componentDidMount() {
    const patientId = idx(this.props, _ => _.match.params.caseId);
    this.props.getCase(patientId);
  }

  componentDidUpdate(prevProps, prevState) {
    const patientId = idx(this.props, _ => _.match.params.caseId);
    const prevPatientId = idx(prevProps, _ => _.match.params.caseId);
    if (patientId !== prevPatientId) {
      this.props.getCase(patientId);
    }
  }

  render() {
    const patientId = idx(this.props, _ => _.match.params.caseId)
    const {
      isExplorerVisible,
      handleSwitchChange
    } = this.props;
    return (
      <>
        <NavTop handleSwitchChange={this.props.handleSwitchChange} isExplorerVisible={this.props.isExplorerVisible}/>
        <NavBottom handleFieldClick={this.props.handleFieldClick} explore={this.props.explore} isExplorerVisible={this.props.isExplorerVisible}/>
        <div className="workspace">
          <div className={`left ${isExplorerVisible ? 'explorer-visible' : ''}`}>
            <CasePanel caseId={patientId} handleFieldClick={this.props.handleFieldClick} explore={this.props.explore}/>
          </div>
          <FhirExplorer
            fieldId={this.props.explore}
            visible={this.props.isExplorerVisible}
          />
        </div>
      </>
    )
  }
}

export default Case;
