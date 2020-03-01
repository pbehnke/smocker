import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Drawer,
  Empty,
  Form,
  Input,
  PageHeader,
  Row
} from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { Actions, actions } from "~modules/actions";
import { AppState } from "~modules/reducers";
import Code from "./Code";
import { Mermaid } from "./Mermaid";
import "./Visualize.scss";

const EditGraph = ({
  display,
  value,
  onChange,
  onClose
}: {
  display: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) => {
  return (
    <Drawer
      title="Edit"
      placement="right"
      className="drawer"
      closable={true}
      onClose={onClose}
      visible={display}
      width="50vw"
      getContainer={false}
    >
      <Form className="form">
        <Code value={value} onBeforeChange={onChange} />
      </Form>
    </Drawer>
  );
};

interface Props extends RouteComponentProps<{}> {
  sessionID: string;
  graph: string;
  visualize: (sessionID: string, src: string, dest: string) => void;
}

const Visualize = ({ sessionID, graph, visualize, history }: Props) => {
  const [diagram, setDiagram] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [dest, setDest] = React.useState("");
  const [editGraph, setEditGraph] = React.useState(false);

  React.useEffect(() => {
    setDiagram(graph);
  }, [graph]);

  React.useEffect(() => {
    visualize(sessionID, src, dest);
  }, [sessionID]);

  const handleChangeSrc = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSrc(event.target.value);
  const handleChangeDest = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDest(event.target.value);
  const handleGenerate = () => visualize(sessionID, src, dest);
  const handleEditGraph = () => setEditGraph(true);
  const handleChangeGraph = (diag: string) => setDiagram(diag);
  const handleCloseEditGraph = () => setEditGraph(false);
  const handleBack = () => {
    history.push("/pages/history");
  };

  const emptyDiagram = !diagram.replace("sequenceDiagram", "").trim();
  return (
    <div className="visualize">
      <PageHeader
        title={"Diagram of calls"}
        extra={
          <div className="action buttons">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back to History
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditGraph}
            >
              Edit
            </Button>
          </div>
        }
      >
        <p className="no-margin">
          This is a graphical representation of call history.
        </p>
        <Collapse bordered={false} defaultActiveKey={[""]} className="collapse">
          <Collapse.Panel
            header="Customize diagram generation"
            key="1"
            className="collapse-panel"
          >
            <Form layout="horizontal">
              <Row>
                <Form.Item label="Source Header" name="src">
                  <Input value={src} onChange={handleChangeSrc} />
                </Form.Item>
                <Form.Item label="Destination Header" name="dest">
                  <Input value={src} onChange={handleChangeDest} />
                </Form.Item>
                <Button type="primary" onClick={handleGenerate}>
                  Generate
                </Button>
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
        <Row className="container">
          {!emptyDiagram && (
            <Card className={"card"}>
              <Mermaid name="diagram" chart={diagram} />
            </Card>
          )}
          {emptyDiagram && (
            <Empty description="The history of calls is empty." />
          )}
        </Row>
      </PageHeader>
      {editGraph && (
        <EditGraph
          display={editGraph}
          value={diagram}
          onClose={handleCloseEditGraph}
          onChange={handleChangeGraph}
        />
      )}
    </div>
  );
};

export default withRouter(
  connect(
    (state: AppState) => {
      const { sessions, history } = state;
      return {
        sessionID: sessions.selected,
        graph: history.graph
      };
    },
    (dispatch: Dispatch<Actions>) => ({
      visualize: (sessionID: string, src: string, dest: string) =>
        dispatch(actions.visualizeHistory.request({ sessionID, src, dest }))
    })
  )(Visualize)
);
