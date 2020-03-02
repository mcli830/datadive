import React from 'react';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';
import Flexbox from '../components/flex/flexbox';
import Segment from '../components/segment/segment';
import ControlPanel from '../components/control/panel';
import Chart from '../components/chart/chart';
import NewChart from '../components/chart/new';
import Inspector from '../components/inspector/inspector';
import theme from '../components/layout/theme';

const IndexPage = () => {

  const [state, setState] = React.useState({
    selected: null,
    data: {},
    charts: {},
  });

  // creates a new chart with no data
  const createChart = (e) => {
    e.stopPropagation();
    setState({
      ...state,
      charts: {
        ...state.charts,
        [Object.keys(state.charts).length]: {
          datasets: [],
          series: 'Line',
        },
      },
    });
  };

  const selectChart = (key) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState({
      ...state,
      selected: key,
    });
  };

  const setSeries = (series) => () => {
    setState({
      ...state,
      charts: {
        ...state.charts,
        [state.selected]: {
          ...state.charts[state.selected],
          series,
        }
      }
    })
  }

  // functon generator:
  // generates random data for the selected chart
  const generateRandom = () => {

    const datakeys = Object.keys(state.data);
    const datakey = datakeys.length ? Math.max(...datakeys) + 1 : 1;

    setState({
      ...state,
      data: {
        ...state.data,
        [datakey]: {
          name: `Random ${datakey}`,
          data: Array(10).fill(0).map((_,i) => ({
            x: i,
            y: Math.floor(Math.random()*10),
          })),
        },
      },
    });
  };

  // link data to chart
  const linkDataToChart = (chartkey) => (datakey) => {

    const chartDatasets = state.charts[chartkey].datasets;
    // do nothing if data is already in chart
    if (chartDatasets.includes(datakey)) return;

    setState({
      ...state,
      charts: {
        ...state.charts,
        [chartkey]: {
          ...state.charts[chartkey],
          datasets: [
            ...chartDatasets,
            datakey,
          ],
        }
      }
    });
  };

  console.log(state)

  return (
    <Layout>
      <SEO title="Data Dive" />
      <Flexbox direction="row" align="stretch" style={{position: 'relative', zIndex: 0}}>

        {/* Left Panel */}
        <Flexbox child basis="20rem">
          <ControlPanel
            datasets={state.data}
            selectedSeries={state.selected ? state.charts[state.selected].series : null}
            setSeries={setSeries}
            generateRandom={generateRandom}
          />
        </Flexbox>

        {/* Middle Panel */}
        <Flexbox child grow="1" shrink="1" basis="auto" onClick={selectChart(null)}>
          <Segment>
            <Segment padding="0 1rem">
              <h2>Charts</h2>
            </Segment>
            <Flexbox direction="row" flexwrap align="center">
              {Object.entries(state.charts).map(([chartkey, chart]) => (
                <Chart
                  key={chartkey}
                  name={`Chart ${chartkey}`}
                  datasets={Object.entries(state.data).filter(([datakey,_]) => {
                    return chart.datasets.includes(datakey);
                  }).map(([_, dataset]) => dataset)}
                  variant={chart.series}
                  active={state.selected === chartkey}
                  selectChart={selectChart(chartkey)}
                  linkData={linkDataToChart(chartkey)}
                />
              ))}
              <NewChart onClick={createChart} />
            </Flexbox>
          </Segment>
        </Flexbox>

        {/* Right Panel */}
        <Flexbox child basis="auto">
          <Inspector open={state.selected !== null} chart={state.charts[state.selected]} />
        </Flexbox>

      </Flexbox>
    </Layout>
  );
};

export default IndexPage;
