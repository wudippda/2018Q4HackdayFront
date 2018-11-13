<template>
  <div>
    <div class="wrapper">
      <ul class="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <Row class="row">
          <Col span="24">
              <div style="text-align:center">
                <img class="logo" src="../assets/shield.png" style="border-radius: 80%;">
                <h3 class="title" style="margin-top: 10px; color:white; font-size: 40px; font-weight: bold" >Open Source Library Risk Rating System</h3>
              </div>
          </Col>
      </Row>

      <Row class="row">
        <Col span="6"><br/></Col>
        <Col span="12">
          <Card id="analysis_card" :bordered="false">
            <p slot="title">Risk Analysis</p>
            <Form label-position="left" ref="formItem" :model="formItem">
              <Row :gutter="10">
                <Col span="4"><br/></Col>
                <Col span="6">
                  <FormItem label="Group Id">
                    <Input label="groupId" type="text" v-model="formItem.libraryA.groupId" placeholder="groupId">
                      <Icon type="ios-football" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="Artifact Id">
                    <Input v-model="formItem.libraryA.artifactId" placeholder="artifactId">
                      <Icon type="ios-basketball" slot="prepend"></Icon>
                    </Input>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem label="Depth">
                    <Select v-model="formItem.libraryA.dependencyDepth" placeholder="select">
                      <Option v-for="item in dependencyDepthList" :value="item">{{ item }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><br/></Col>
                <Col span="10">
                  <FormItem label="Compare with another library?">
                    <i-switch v-model="formItem.switch" size="large">
                      <span slot="open">yes</span>
                      <span slot="close">no</span>
                    </i-switch>
                  </FormItem>
                </Col>
              </Row>
              <transition name="fade">
                <Row v-if="getSwitchStatus()" ref="another_library" :gutter="10">
                  <Col span="4"><br/></Col>
                  <Col span="6">
                    <FormItem label="Group Id">
                      <Input label="groupId" type="text" v-model="formItem.libraryB.groupId" placeholder="groupId">
                        <Icon type="ios-baseball-outline" slot="prepend"></Icon>
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="Artifact Id">
                      <Input v-model="formItem.libraryB.artifactId" placeholder="artifactId">
                        <Icon type="ios-tennisball" slot="prepend"></Icon>
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                  <FormItem label="Depth">
                    <Select v-model="formItem.libraryB.dependencyDepth" placeholder="select">
                      <Option v-for="item in dependencyDepthList" :value="item">{{ item }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                </Row>
              </transition>
              <Row>
                <Col span="4"><br/></Col>
                <Col span="16">
                  <FormItem>
                    <Button shape="circle" icon="ios-search" long='true' type="primary" @click="handleOSS()">Analyze</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Spin size="large" fix v-if="analysisSpinShow"></Spin>
        </Col>
      </Row>

      <transition name="fade">
        <Row class="row" v-if="resAReturned">
          <Col span="6"><br/></Col>
          <Col span="12">
            <div>
              <Card>
                <p slot="title">Analysis Result</p>
                <Row>
                  <Col span="1"><br/></Col>
                  <Col span="12">
                    <Row>
                      <Col span="8" style="font-size: 35px">
                        <Badge count="BEST" class-name="demo-badge-alone">
                          <p style="margin-top: 5px">{{ results.libraryA.artifactId }}</p>
                        </Badge>
                        <p style="margin-top: 10px">{{ results.libraryA.version_scores[0].version }}</p>
                      </Col>
                      <Col span="16">
                        <i-circle :size="100" :percent="Number((results.libraryA.version_scores[0].security_score).toFixed())" stroke-color="#5cb85c" style="font-size: 35px">
                          <div class="iCountUp">
                            <ICountUp
                              :startVal="0"
                              :endVal="Number((results.libraryA.version_scores[0].security_score).toFixed())"
                              :decimals="0"
                              :duration="5"
                            />
                          </div>
                        </i-circle>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Vulnerability Score: <Progress :percent="Number((results.libraryA.version_scores[0].self_vulnerability_score).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Reputation Score: <Progress :percent="Number((results.libraryA.version_scores[0].history_reputation_score).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Age Score: <Progress :percent="Number((results.libraryA.version_scores[0].age_score * 10).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Dependency Score: <Progress :percent="Number((results.libraryA.version_scores[0].dependency_security).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Popularity Score: <Progress :percent="Number((results.libraryA.version_scores[0].popularity_score * 10).toFixed())"/>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="10">
                    <Card style="overflow: hidden;">
                      <p slot="title">Other Versions</p>
                      <Row style="margin-top: 5px" v-for="(item, index) in results.libraryA.version_scores">
                        <Col span="4" style="margin-top: 12px; font-size: 18px">
                          {{ index + 1 }}.
                        </Col>
                        <Col span="12" style="margin-top: 12px; font-size: 15px">
                          <div>{{ results.libraryA.artifactId }} | {{ item.version }}</div>
                        </Col>
                        <Col span="8">
                          <i-circle :size="40" :percent="Number((item.security_score).toFixed())" stroke-color="#5cb85c" style="font-size: 15px">
                            <div class="iCountUp">
                              <ICountUp
                                :startVal="0"
                                :endVal="Number((item.security_score).toFixed())"
                                :decimals="0"
                                :duration="5"
                              />
                            </div>
                          </i-circle>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </transition>

       <transition name="fade">
        <Row class="row" v-if="formItem.switch && resBReturned">
          <Col span="6"><br/></Col>
          <Col span="12">
            <div>
              <Card>
                <p slot="title">Analysis Result</p>
                <Row>
                  <Col span="1"><br/></Col>
                  <Col span="12">
                    <Row>
                      <Col span="8" style="font-size: 35px">
                        <Badge count="BEST" class-name="demo-badge-alone">
                          <p style="margin-top: 5px">{{ results.libraryB.artifactId }}</p>
                        </Badge>
                        <p style="margin-top: 10px">{{ results.libraryB.version_scores[0].version }}</p>
                      </Col>
                      <Col span="16">
                        <i-circle :size="100" :percent="Number((results.libraryB.version_scores[0].security_score).toFixed())" stroke-color="#5cb85c" style="font-size: 35px">
                          <div class="iCountUp">
                            <ICountUp
                              :startVal="0"
                              :endVal="Number((results.libraryB.version_scores[0].security_score).toFixed())"
                              :decimals="0"
                              :duration="5"
                            />
                          </div>
                        </i-circle>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Vulnerability Score: <Progress :percent="Number((results.libraryB.version_scores[0].self_vulnerability_score).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Reputation Score: <Progress :percent="Number((results.libraryB.version_scores[0].history_reputation_score).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Age Score: <Progress :percent="Number((results.libraryB.version_scores[0].age_score * 10).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Dependency Score: <Progress :percent="Number((results.libraryB.version_scores[0].dependency_security).toFixed())"/>
                      </Col>
                    </Row>
                    <Row style="margin-top: 10px;">
                      <Col span="20">
                        Popularity Score: <Progress :percent="Number((results.libraryB.version_scores[0].popularity_score * 10).toFixed())"/>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="10">
                    <Card style="overflow: hidden;">
                      <p slot="title">Other Versions</p>
                      <Row style="margin-top: 5px" v-for="(item, index) in results.libraryB.version_scores">
                        <Col span="4" style="margin-top: 12px; font-size: 18px">
                          {{ index + 1 }}.
                        </Col>
                        <Col span="12" style="margin-top: 12px; font-size: 15px">
                          <div>{{ results.libraryB.artifactId }} | {{ item.version }}</div>
                        </Col>
                        <Col span="8">
                          <i-circle :size="40" :percent="Number((item.security_score).toFixed())" stroke-color="#5cb85c" style="font-size: 15px">
                            <div class="iCountUp">
                              <ICountUp
                                :startVal="0"
                                :endVal="Number((item.security_score).toFixed())"
                                :decimals="0"
                                :duration="5"
                              />
                            </div>
                          </i-circle>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </transition>

      <Row class="row">
        <Col span="6"><br/></Col>
        <Col span="12">
          <Card class="mario">
          </Card>
        </Col>
      </Row>
      <Row class="row">
        <p style="color:white; font-size: 15px; font-weight: bold">Developped by</p>
      </Row>
      <Row style="margin-top: 10px; margin-bottom: 100px">
        <Col span="6"><br/></Col>
        <Col span="12" style="color:white; font-size: 12px; font-weight: bold">
          <Avatar style="background-color: #3399ff" icon="ios-person" />
          sun.xun@sap.com;
          <Avatar style="background-color: #ffbf80; margin-left: 5px" icon="ios-person" />
          norlan.yan@sap.com;
          <Avatar style="background-color: #e6ac00; margin-left: 5px" icon="ios-person" />
          francis.zhong@sap.com;
        </Col>
      </Row>
      
    </div>
  </div>
</template>

<script>
  import { ossScore } from '../service/apis'
  import ICountUp from 'vue-countup-v2';
  var md5 = require('js-md5')

  export default {
    components: {
      ICountUp
    },
    methods: {
      mounted () {
         document.title = this.name;
      },
      handleOSS() {
        this.analysisSpinShow = true;
        this.resAReturned = false;
        this.resBReturned = false;
        if (!this.formItem.switch) {
          console.log(this.formItem.libraryA.groupId + " " + this.formItem.libraryA.artifactId + " " + this.formItem.libraryA.dependencyDepth)
          this.results.libraryA = {}
          ossScore(this.formItem.libraryA.groupId, this.formItem.libraryA.artifactId, this.formItem.libraryA.dependencyDepth).then(res => {
            
            //if (res.size > 0 && res.version_scores) {
              this.results.libraryA = res
            //}
            this.analysisSpinShow = false
            this.resAReturned = true;

          }).catch(err => {
            console.error(err)
            this.analysisSpinShow = false
            this.resAReturned = false;
          })
        } else {
          this.results.libraryA = {}
          ossScore(this.formItem.libraryA.groupId, this.formItem.libraryA.artifactId, this.formItem.libraryA.dependencyDepth).then(res => {
            
            //if (res.size > 0 && res.version_scores) {
            this.results.libraryA = res
            //}
            this.analysisSpinShow = false
            this.resAReturned = true;

          }).catch(err => {
            console.error(err)
            this.analysisSpinShow = false
            this.resAReturned = true;
          })
          this.results.libraryB = {}
          ossScore(this.formItem.libraryB.groupId, this.formItem.libraryB.artifactId, this.formItem.libraryB.dependencyDepth).then(res => {
            
            //if (res.size > 0 && res.version_scores) {
            this.results.libraryB = res
            //}
            this.analysisSpinShow = false
            this.resBReturned = true;

          }).catch(err => {
            console.error(err)
            this.analysisSpinShow = false
            this.resBReturned = true;
          })
        }
      },
      getSwitchStatus() {
        return this.formItem.switch;
      }
    },
    data () {
      return {
        dependencyDepthList: [0, 1, 2],
        name: 'risk analysis',
        resAReturned: false,
        resBReturned: false,
        analysisSpinShow: false,
        formItem: {
          switch: false,
          libraryA: {
            groupId: '',
            artifactId: '',
            dependencyDepth: 0,
          },
          libraryB: {
            groupId: '',
            artifactId: '',
            dependencyDepth: 0,
          },
        },
        results: {
          libraryA: {},
          libraryB: {},
        },
      }
    }
  }
</script>

<style scoped>

  .demo-split{
      height: 200px;
      border: 1px solid #dcdee2;
  }
  .demo-split-pane{
      padding: 10px;
  }

  .demo-badge-alone{
    background: #5cb85c !important;
  }

  .wrapper {
    background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .bg-bubbles li {
    position: absolute;
    list-style: none;
    display: block;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    bottom: 0px;
    -webkit-animation: square 25s infinite;
    animation: square 25s infinite;
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
  }
  .bg-bubbles li:nth-child(1) {
    left: 10%;
  }
  .bg-bubbles li:nth-child(2) {
    left: 20%;
    width: 80px;
    height: 80px;
    -webkit-animation-delay: 2s;
            animation-delay: 2s;
    -webkit-animation-duration: 17s;
            animation-duration: 17s;
  }
  .bg-bubbles li:nth-child(3) {
    left: 25%;
    -webkit-animation-delay: 4s;
            animation-delay: 4s;
  }
  .bg-bubbles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    -webkit-animation-duration: 22s;
            animation-duration: 22s;
    background-color: rgba(255, 255, 255, 0.25);
  }
  .bg-bubbles li:nth-child(5) {
    left: 70%;
  }
  .bg-bubbles li:nth-child(6) {
    left: 80%;
    width: 120px;
    height: 120px;
    -webkit-animation-delay: 3s;
            animation-delay: 3s;
    background-color: rgba(255, 255, 255, 0.2);
  }
  .bg-bubbles li:nth-child(7) {
    left: 32%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 7s;
            animation-delay: 7s;
  }
  .bg-bubbles li:nth-child(8) {
    left: 55%;
    width: 20px;
    height: 20px;
    -webkit-animation-delay: 15s;
            animation-delay: 15s;
    -webkit-animation-duration: 40s;
            animation-duration: 40s;
  }
  .bg-bubbles li:nth-child(9) {
    left: 25%;
    width: 10px;
    height: 10px;
    -webkit-animation-delay: 2s;
            animation-delay: 2s;
    -webkit-animation-duration: 40s;
            animation-duration: 40s;
    background-color: rgba(255, 255, 255, 0.3);
  }
  .bg-bubbles li:nth-child(10) {
    left: 90%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 11s;
            animation-delay: 11s;
  }

  @-webkit-keyframes square {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
              transform: translateY(-700px) rotate(600deg);
    }
  }
  @keyframes square {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
              transform: translateY(-700px) rotate(600deg);
    }
  }

  .row {
    margin-top: 20px;
  }
  /* animation */
  .title {
    font-size: 25px;
  }
  .slide-fade-enter-active {
      transition: all .5s ease;
  }
  .slide-fade-leave-active {
      transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-active {
      transform: translateX(30px);
      opacity: 0;
  }
  .slide-up-enter-active {
      transition: all .5s ease;
  }
  .slide-up-leave-active {
      transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-up-enter, .slide-up-leave-active {
      transform: translateY(30px);
      opacity: 0;
  }
  .bg-container {
      background-image: url('/static/img/login-bg.jpg');
      background-size: cover;
      height: 100%;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      align-items: center
  }
  .login-card {
      position: absolute;
      width: 400px;
      top: 15%; 
      background-color: rgba(255,255,255,0.3);
  }
  .logo {
      width: 150px;
      margin-bottom: 20px;
  }
  .form-item {
      width: 250px; 
      margin: 25px auto;
  }
  .register-tip {
      font-size: 1.13em;
      text-decoration: underline;
  }

  .mario {
    height: 200px;
    background-image: url("http://portfolio.kageetai.net/mario/mario.gif"), url("http://portfolio.kageetai.net/mario/ground.png"), url("http://portfolio.kageetai.net/mario/bushes.png"), url("http://portfolio.kageetai.net/mario/back.png");
    background-color: #F8E0B0;
    background-repeat: no-repeat, repeat-x, repeat-x, repeat-x;
    background-position: left 30% bottom 24px, left 0px bottom 0px, left 0px bottom 24px, left 0px bottom 0px;
    -webkit-animation: back 15s infinite linear;
            animation: back 15s infinite linear;
  }

  @-webkit-keyframes back {
    0% {
      background-position: left 30% bottom 24px, left 0px bottom 0px, left 0px bottom 24px, left 0px bottom 0px;
    }
    50% {
      background-position: left 50% bottom 24px, left -816px bottom 0px, left -508px bottom 24px, left -256px bottom 0px;
    }
    100% {
      background-position: left 30% bottom 24px, left -1632px bottom 0px, left -1016px bottom 24px, left -512px bottom 0px;
    }
  }

  @keyframes back {
    0% {
      background-position: left 30% bottom 24px, left 0px bottom 0px, left 0px bottom 24px, left 0px bottom 0px;
    }
    50% {
      background-position: left 50% bottom 24px, left -816px bottom 0px, left -508px bottom 24px, left -256px bottom 0px;
    }
    100% {
      background-position: left 30% bottom 24px, left -1632px bottom 0px, left -1016px bottom 24px, left -512px bottom 0px;
    }
  }

</style>