<template>
  <div class="container">
    <div class="demo-tabs-style1">
      <h1>ICO Detail</h1>
      <Tabs type="card">
        <TabPane label="General Info">
          <table class="general-info">
            <tr>
              <th>Leader:</th>
              <td>leader1</td>
              <th>Investors:</th>
              <td>2</td>
            </tr>
            <tr>
              <th>Total Tokens:</th>
              <td>11</td>
              <th>Pool Cap:</th>
              <td>{{pCap}}</td>
            </tr>
            <tr>
              <th>Min Individual Contribution:</th>
              <td><span v-show="!showField('min')">{{individualCon.min}}</span>
                <input class="individualCon" v-model="individualCon.min" v-show="showField('min')" type="number" @focus="focusField('min')" @blur="blurField('min')">
                <Icon size="20" class="icon" type="android-settings" @click.native="focusField('min')"></Icon>
              </td>
              <th>Max Individual Contribution:</th>
              <td><span v-show="!showField('max')">{{individualCon.max}}</span>
                <input class="individualCon" v-model="individualCon.max" v-show="showField('max')" type="number" @focus="focusField('max')" @blur="blurField('max')">
                <Icon size="20" class="icon" type="android-settings" @click.native="focusField('max')"></Icon>
              </td>
            </tr>
            <tr>
              <th>Pool Address:</th>
              <td>{{paddress}}
                <Icon size="20" class="icon" @click.native="doCopy" type="ios-copy-outline"></Icon>
              </td>
            </tr>
          </table>
        </TabPane>
        <TabPane label="Investors">
          <Table border :columns="investors" :data="invData"></Table>
        </TabPane>
        <TabPane label="WhiteList">
          <div class="editable" contenteditable="true">
            <ul ref="allAddress">
              <li v-for="add in invData">{{add.waddress}}</li>
            </ul>
          </div>
          <div class="btn">
            <Button>Cancel</Button>
            <Button type="primary" @click="submitAddress">Submit</Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      pCap: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        individualCon: {
          min: 0.1,
          max: 0.5
        },
        editField: "",
        paddress: "0xbbf67aaa",
        investors: [{
            title: "From",
            key: "from"
          },
          {
            title: "txid",
            key: "txid"
          },
          {
            title: "eth contribution",
            key: "econ"
          },
          {
            title: "wallet address",
            key: "waddress"
          }
        ],
        invData: [{
            from: "test1",
            txid: "0xc52c188ab7a3f14e6bb1",
            econ: 0.1,
            waddress: "0x97ff6d6C80A0658c574ea4fE0D6C3185410ed8B1"
          },
          {
            from: "test2",
            txid: "0xc52c188ab7a3f14e6bb2",
            econ: 0.3,
            waddress: "0x97ff6d6C80A0658c574ea4fE0D6C3185410ed8B2"
          },
          {
            from: "test3",
            txid: "0xc52c188ab7a3f14e6bb3",
            econ: 0.2,
            waddress: "0x97ff6d6C80A0658c574ea4fE0D6C3185410ed8B3"
          },
          {
            from: "test4",
            txid: "0xc52c188ab7a3f14e6bb4",
            econ: 0.1,
            waddress: "0x97ff6d6C80A0658c574ea4fE0D6C3185410ed8B4"
          }
        ]
      };
    },
    methods: {
      doCopy: function() {
        this.$copyText(this.paddress).then(
          function(e) {
            alert("Copied");
          },
          function(e) {
            alert("Can not copy");
          }
        );
      },
      focusField(val) {
        this.editField = val;
      },
      blurField(val) {
        this.editField = parseFloat(
          this.individualCon[val].replace(/[^\d\.]/g, "")
        );
        this.individualCon[val] = this.editField
          .toFixed(1)
          .replace(/(\d)(?=(\d{2})+(?:\.\d+)?$)/g, "$1,");
        if (this.individualCon[val] > this.pCap) {
          this.individualCon[val] = this.pCap;
        }
        if (val === "min") {
          if (this.individualCon[val] < 0.1) {
            this.individualCon[val] = 0.1;
          }
        }
        if (val === "max") {
          if (this.individualCon[val] < this.individualCon.min) {
            this.individualCon[val] = this.individualCon.min;
          }
        }
      },
      showField(val) {
        return this.individualCon[val] === "" || this.editField === val;
      },
      submitAddress() {
        let allLi = this.$refs.allAddress.children
        let addressList = []
        for (let i = 0; i < allLi.length; i++) {
          addressList.push(allLi[i].innerText)
        }
        const count = addressList =>
          addressList.reduce((a, b) =>
            Object.assign(a, {
              [b]: (a[b] || 0) + 1
            }), {})
        const duplicates = dict =>
          Object.keys(dict).filter((c) => dict[c] > 1)
        if (duplicates(count(addressList)).length) {
          alert('cannot submit duplicate address')
        } else {
          alert('submitted')
        }
      }
    }
  }
</script>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ul li {
    list-style-type: none;
  }

  .editable {
    border-style: solid;
    border-width: 1px;
    height: 150px;
    overflow: hidden;
  }

  .ivu-table-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ivu-table-cell:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }

  .icon {
    padding-left: 10px;
  }

  .btn {
    float: right;
    padding-top: 30px;
  }

  th {
    text-align: right;
    padding-right: 10px;
  }

  .individualCon {
    width: 23px;
  }

  .general-info {
    height: 100%;
    width: 85%;
  }

  .demo-tabs-style1 {
    background: #e3e8ee;
    padding: 16px;
    width: 50%;
    margin: 50px auto;
  }

  .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-content {
    margin-top: -16px;
  }

  .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-content>.ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .demo-tabs-style1>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }

  .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }

  .demo-tabs-style2>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    border-radius: 0;
    background: #fff;
  }

  .demo-tabs-style2>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
    border-top: 1px solid #3399ff;
  }

  .demo-tabs-style2>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active:before {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
