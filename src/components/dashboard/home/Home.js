import React, { Component } from "react";
import {
  Tabs,
  Tab,
  withStyles,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Button
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  getQuestions,
  saveSingleQuestion
} from "../../../actions/questionActions";
import {setToAnsweredPollPage,setToPollPage} from '../../../actions/showPollPageActions';

class Home extends Component {
  state = {
    tabValue: 0
  };

  componentDidMount() {
    this.props.getQuestions();
  }

  onChange = (e, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { tabValue } = this.state;
    const {
      questionTitle,
      questionCardContent,
      questionCardMedia,
      questionCardText,
      questionButtonFullWidth,
      tabIndicator,
      tabs,
      tabSelected
    } = this.props.classes;
    const { questions } = this.props.questions;
    const { user, users } = this.props.users;

    let unansweredContent;
    let answeredContent;
    let unanswered = [];

    if (Object.keys(questions).length > 0) {
      unanswered = Object.keys(questions).filter(question => {
        return !Object.keys(user.answers).includes(question);
      });

      unansweredContent = unanswered.reverse().map(question => (
        <Card key={question}>
          <CardHeader
            classes={{
              title: questionTitle
            }}
            title={`${questions[question].author} asks :`}
          />
          <CardContent
            classes={{
              root: questionCardContent
            }}
          >
            <CardMedia
              classes={{
                media: questionCardMedia
              }}
              component="img"
              src={users[questions[question].author].avatarURL}
            />
            <div style={{ borderLeft: "1px solid grey", marginLeft: "10%" }}>
              <Typography
                classes={{
                  root: questionCardText
                }}
              >
                Would you rather
              </Typography>
              <Typography>
                {`...${questions[question].optionOne.text.substr(
                  0,
                  questions[question].optionOne.text.length > 4
                    ? 4
                    : questions[question].optionOne.text.length
                )}...`}
              </Typography>
              <Button
                classes={{
                  fullWidth: questionButtonFullWidth
                }}
                fullWidth
                variant="outlined"
                style={styles.questionButton}
                onClick={() => {
                    this.props.setToPollPage(question,this.props.history);
                  this.props.saveSingleQuestion(questions[question]);
                }}
              >
                View Poll
              </Button>
            </div>
          </CardContent>
        </Card>
      ));
    }

    if (Object.keys(questions).length > 0) {
      answeredContent = Object.keys(user.answers)
        .reverse()
        .map(answer => {
          return (
            <Card key={answer}>
              <CardHeader
                classes={{
                  title: questionTitle
                }}
                title={`${questions[answer].author} asks :`}
              />
              <CardContent
                classes={{
                  root: questionCardContent
                }}
              >
                <CardMedia
                  classes={{
                    media: questionCardMedia
                  }}
                  component="img"
                  src={users[questions[answer].author].avatarURL}
                />
                <div
                  style={{ borderLeft: "1px solid grey", marginLeft: "10%" }}
                >
                  <Typography
                    classes={{
                      root: questionCardText
                    }}
                  >
                    Would you rather
                  </Typography>
                  <Typography>
                    {`...${questions[answer].optionOne.text.substr(
                      0,
                      questions[answer].optionOne.text.length > 4
                        ? 4
                        : questions[answer].optionOne.text.length
                    )}...`}
                  </Typography>
                  <Button
                    classes={{
                      fullWidth: questionButtonFullWidth
                    }}
                    fullWidth
                    variant="outlined"
                    style={styles.questionButton}
                    onClick={() => {
                        this.props.setToAnsweredPollPage(answer,this.props.history);
                      this.props.saveSingleQuestion(questions[answer]);
                    }}
                  >
                    View Poll
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        });
    }

    return (
      <div>
        <Tabs
          classes={{
            indicator: tabIndicator
          }}
          onChange={this.onChange}
          value={tabValue}
          name="tabValue"
        >
          <Tab
            classes={{
              root: tabs,
              selected: tabSelected
            }}
            label="Unanswered"
          />
          <Tab
            classes={{
              root: tabs,
              selected: tabSelected
            }}
            label="Answered"
          />
        </Tabs>

        {tabValue === 0 ? (
          <div style={styles.tabContainers}>{unansweredContent}</div>
        ) : (
          <div style={styles.tabContainers}>{answeredContent}</div>
        )}
      </div>
    );
  }
}

const styles = {
  tabs: {
    backgroundColor: "#fff",
    border: "1px solid #ebebe0",
    height: "5vh",
    width: "65vw"
  },
  tabIndicator: {
    borderBottom: "5px solid #ebebe0"
  },
  tabSelected: {
    backgroundColor: "#f5f5f0",
    border: "1px solid #ebebe0",
    height: "5vh"
  },
  tabContainers: {
    height: "63vh",
    width: "45vw",
    backgroundColor: "#fff",
    border: "1px solid #ebebe0"
  },
  questionTitle: {
    textAlign: "left"
  },
  questionCardContent: {
    display: "flex",
    flexWrap: "nowrap"
  },
  questionCardMedia: {
    width: "5vw",
    height: "10vh"
  },
  questionCardText: {
    marginLeft: "9%",
    whiteSpace: "nowrap",
    fontWeight: "800"
  },
  questionButton: {
    color: "#66ff99",
    border: "1px solid #66ff99"
  },
  questionButtonFullWidth: {
    marginLeft: "9%"
  }
};

const mapStateToProps = state => ({
  users: state.users,
  questions: state.questions
});

export default connect(
  mapStateToProps,
  { getQuestions,setToPollPage, saveSingleQuestion,setToAnsweredPollPage }
)(withStyles(styles)(Home));
