<template>
  <div>
    <!-- 搜索添加账号 -->
    <div class="flex a-c" style="margin:5px">
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加类型</el-button
      >
    </div>
    <!-- 客房类型列表数据 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="类型编号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomTypeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.bedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomTypePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            type="warning"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer
      size="45%"
      :title="isAdd ? '添加客房类型' : '修改客房类型'"
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
          <el-form-item label="类型名称" prop="roomTypeName">
            <el-input
              v-model="ruleForm.roomTypeName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="床位数" prop="bedNum">
            <el-input
              v-model.number="ruleForm.bedNum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model.number="ruleForm.roomTypePrice"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="typeDescription">
            <quill-editor
              ref="myQuillEditor"
              v-model="ruleForm.typeDescription"
              style="height:300px;margin-bottom:100px"
            />
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
export default {
  data() {
    var validateRoomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入类型名称"));
      } else {
        callback();
      }
    };
    var validateBedNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入床位数"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    var validateRoomTypePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    var validateTypeDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入类型描述"));
      } else {
        callback();
      }
    };
    return {
      pageIndex: 1,
      roleId: "",
      count: 0,
      tableData: [],
      roleListToSearch: [],
      drawer: false,
      isAdd: true,
      direction: "rtl",
      ruleForm: {
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: "",
        typeDescription: "",
      },
      rules: {
        roomTypeName: [{ validator: validateRoomTypeName, trigger: "blur" }],
        bedNum: [{ validator: validateBedNum, trigger: "blur" }],
        roomTypePrice: [{ validator: validateRoomTypePrice, trigger: "blur" }],
        typeDescription: [
          { validator: validateTypeDescription, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // addRole(){
    //   this.$post('/')
    // },
    async getTableData() {
      let data = await this.$get("/RoomType/List");
      this.tableData = data;
    },
    async handleEdit(index, row) {
      let roomTypeId = row.roomTypeId;
      let res = await this.$get("/RoomType/GetOne", { roomTypeId });
      this.ruleForm = res;
      this.isAdd = false;
      this.drawer = true;
    },
    async handleDelete(index, row) {
      console.log(row);
      await this.$confirm("是否确认删除？");
      let roomTypeId = row.roomTypeId;
      // let res = await this.$post("/Admin/Delete", { loginId });
      // console.log(res);
      let { success, message } = await this.$post("/RoomType/Delete", {
        roomTypeId,
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
              "/RoomType/Add",
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
              "/RoomType/Update",
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
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: "",
        typeDescription: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
