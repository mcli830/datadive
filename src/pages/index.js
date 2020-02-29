import React from 'react';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';
import Flexbox from '../components/flex/flexbox';
import Segment from '../components/segment/segment';
import ControlPanel from '../components/control/panel';
import Chart from '../components/chart/chart';
import NewChart from '../components/chart/new';

const IndexPage = () => {

  const [state, setState] = React.useState({
    data: {},
    charts: {},
  });

  // creates a new chart with no data
  const createChart = () => {
    setState({
      ...state,
      charts: {
        ...state.charts,
        [Object.keys(state.charts).length]: { datakey: null },
      },
    });
  }

  // functon generator:
  // generates random data for the selected chart
  const generateRandom = (chartKey) => () => {

    const datakey = Object.keys(state.data).length;

    setState({
      ...state,
      data: {
        ...state.data,
        [datakey]: Array(10).fill(0).map((_,i) => ({
          x: i,
          y: Math.floor(Math.random()*10),
        })),
      },
      charts: {
        ...state.charts,
        [chartKey]: {
          ...state.charts[chartKey],
          datakey,
        }
      }
    });
  }

  return (
    <Layout>
      <SEO title="Data Dive" />
      <h1>Data Dive</h1>
      <Flexbox parent direction="row">

        {/* Left Panel */}
        <Flexbox child basis="20rem">
          <ControlPanel datasets={state.data} />
        </Flexbox>

        {/* Right Panel */}
        <Flexbox child grow="1" shrink="1">
          <Segment>
            <Segment padding="0 1rem">
              <h2>Charts</h2>
            </Segment>
            <Flexbox parent direction="row" wrap align="center">
              {Object.entries(state.charts).map(([key, chart]) => (
                <Chart
                  key={key}
                  dataset={state.data[chart.datakey]}
                  generateRandom={generateRandom(key)}
                />
              ))}
              <NewChart onClick={createChart} />
            </Flexbox>
          </Segment>
        </Flexbox>

      </Flexbox>
    </Layout>
  );
};

export default IndexPage;
