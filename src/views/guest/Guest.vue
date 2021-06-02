<template>
  <div>
    <!-- 搜索添加账号 -->
    <div class="flex a-c" style="margin:5px">
      <span style="font-size:12px">客户姓名：</span>
      <el-input
        v-model="guestName"
        placeholder="请输入客户姓名"
        size="mini"
        style="width:200px;margin-right:10px"
        clearable
      ></el-input>
      <span style="font-size:12px">结账状态：</span>
      <el-select
        v-model="resideStateId"
        placeholder="请选择结账状态"
        clearable
        size="mini"
        style="margin-right:10px"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="getTableData"
        >搜索</el-button
      >
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加</el-button
      >
      <el-button type="primary" size="mini">导出Excel</el-button>
    </div>
    <!-- 账号列表数据 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="编号" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.guestId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.guestName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.identityId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间号" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.room.roomType.roomTypeName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="70" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.room.roomType.roomTypePrice
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床位" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.room.roomType.bedNum
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人数" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.guestNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住时间" width="150" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.resideDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离开时间" width="150" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.leaveDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结账状态" width="70" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.resideStateId === 1 ? 'warning' : 'success'"
            disable-transitions
            >{{ scope.row.resideState.resideStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            type="text"
            v-if="scope.row.resideStateId === 1"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            style="color: #67C23A"
            v-if="scope.row.resideStateId === 1"
            @click="handlePay(scope.$index, scope.row)"
            >结账</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            style="color:#F56C6C"
            v-if="scope.row.resideStateId === 2"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex j-c" style="margin-top:5px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加客户' : '修改客户'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div style="padding:0 10px">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item label="姓名" prop="guestName">
            <el-input
              v-model="ruleForm.guestName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identityId">
            <el-input
              v-model="ruleForm.identityId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客房类型" prop="roomTypeId">
            <el-select
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              clearable
              @change="changeRoomTypeId"
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客房" prop="roomId">
            <el-select
              v-model="ruleForm.roomId"
              placeholder="请选择客房"
              clearable
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住日期" prop="resideDate">
            <el-date-picker
              v-model="ruleForm.resideDate"
              type="datetime"
              placeholder="请选择入住时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="押金" prop="deposit">
            <el-input v-model="ruleForm.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="入住人数" prop="guestNum">
            <el-input v-model="ruleForm.guestNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { format } from "echarts";
import { export_json_to_excel } from "../../Excel/Export2Excel";
export default {
  data() {
    var validateGuestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户姓名"));
      } else {
        callback();
      }
    };
    var validateIdentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间类型"));
      } else {
        callback();
      }
    };
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间号"));
      } else {
        callback();
      }
    };
    var validateResideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住时间"));
      } else {
        callback();
      }
    };
    var validateDeposit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入押金"));
      } else {
        callback();
      }
    };
    var validateGuestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住人数"));
      } else {
        callback();
      }
    };
    return {
      resideStateId: "",
      guestName: "",
      roomId: "",
      dialogImageUrl: "",
      dialogVisible: false,
      dialogVisible1: false,
      pageIndex: 1,
      count: 0,
      tableData: [],
      roomTypeId: "",
      roomStateId: "",
      roomTypeList: [],
      roomList: [],
      roomStateList: [],
      roomStateListToSearch: [],
      resideStateList: [],
      drawer: false,
      isAdd: true,
      direction: "rtl",
      ruleForm: {
        guestId: "",
        guestName: "",
        identityId: "",
        phone: "",
        roomTypeId: "",
        roomId: "",
        resideDate: "",
        deposit: "",
        guestNum: "",
      },
      rules: {
        guestName: [{ validator: validateGuestName, trigger: "blur" }],
        identityId: [{ validator: validateIdentityId, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "blur" }],
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        resideDate: [{ validator: validateResideDate, trigger: "blur" }],
        deposit: [{ validator: validateDeposit, trigger: "blur" }],
        guestNum: [{ validator: validateGuestNum, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getTableData();
    this.getResideStateList();
    this.getRoomTypeList();
  },
  methods: {
    // addRole(){
    //   this.$post('/')
    // },
    // Excel导出方法
    exportExcel() {
      let th = ["房间号", "房间类型", "床位数", "价格", "状态"];
      let jsonData = this.tableData.map((r) => {
        return {
          roomId: r.roomId,
          roomTypeName: r.roomType.roomTypeName,
          bedNum: r.roomType.bedNum,
          roomTypePrice: r.roomType.roomTypePrice,
          roomStateName: r.roomState.roomStateName,
        };
      });
      let defaultTitle = "客房信息表";
      export_json_to_excel(th, jsonData, defaultTitle);
    },
    currentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    async getTableData() {
      let { data, count } = await this.$get("/GuestRecord/List", {
        resideStateId: this.resideStateId || 0,
        guestName: this.guestName || "",
        pageIndex: this.pageIndex,
      });
      this.tableData = data;
      this.count = count;
    },
    async getResideStateList() {
      let res = await this.$get("/ResideState/List");
      this.resideStateList = res;
    },
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    async getRoomList() {
      let roomTypeId = this.ruleForm.roomTypeId;
      if (roomTypeId) {
        let { data } = await this.$get("/Room/List", {
          roomTypeId,
          roomStateId: 1,
          guestId: this.ruleForm.guestId || 0,
        });
        this.roomList = data;
      }
    },
    changeRoomTypeId() {
      this.ruleForm.roomId = "";
      this.getRoomList();
    },
    async handleEdit(index, row) {
      let guestId = row.guestId;
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      this.ruleForm = res;
      this.ruleForm.roomTypeId = res.room.roomTypeId;
      this.getRoomList();
      this.isAdd = false;
      this.drawer = true;
    },
    async handleDelete(index, row) {
      await this.$confirm("是否确认删除？");
      let guestId = row.guestId;
      // let res = await this.$post("/Admin/Delete", { loginId });
      // console.log(res);
      let { success, message } = await this.$post("/GuestRecord/Delete", {
        guestId,
      });
      if (success) {
        this.$msg_s(message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        this.$msg_e(message);
        return false;
      }
    },
    async handlePay(index, row) {
      let guestId = row.guestId;
      let { totalMoney } = await this.$post("/GuestRecord/Checkout", {
        guestId,
      });
      this.$msg_s("结账成功！需支付房间费用：" + totalMoney + "元");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.resetForm("ruleForm");
          this.isAdd = true;
          done();
        })
        .catch((_) => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            let { success, message } = await this.$post(
              "/GuestRecord/Add",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$msg_e(message);
            }
          } else {
            let { success, message } = await this.$post(
              "/GuestRecord/Update",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$msg_e(message);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        guestName: "",
        identityId: "",
        phone: "",
        roomTypeId: "",
        roomId: "",
        resideDate: "",
        deposit: "",
        guestNum: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
