<template>
  <div>
    <!-- 搜索添加账号 -->
    <div class="flex a-c" style="margin:5px">
      <span style="font-size:12px">类型：</span>
      <el-select
        v-model="roomTypeId"
        placeholder="请选择房间类型"
        clearable
        size="mini"
        style="margin-right:10px"
      >
        <el-option
          v-for="item in roomTypeListToSearch"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"
        >
        </el-option>
      </el-select>
      <span style="font-size:12px">状态：</span>
      <el-select
        v-model="roomStateId"
        placeholder="请选择房间状态"
        clearable
        size="mini"
        style="margin-right:10px"
      >
        <el-option
          v-for="item in roomStateListToSearch"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
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
      <el-table-column label="房间号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.roomType.roomTypeName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomType.bedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.roomType.roomTypePrice
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.roomStateId === 1
                ? 'success'
                : scope.row.roomStateId === 2
                ? 'danger'
                : 'warning'
            "
            disable-transitions
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleShowImg(scope.$index, scope.row)"
            type="success"
            >图片</el-button
          >
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
      size="45%"
      :title="isAdd ? '添加客房' : '修改客房'"
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
          <el-form-item label="房间号" prop="roomId">
            <el-input
              v-model.number="ruleForm.roomId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              v-model="ruleForm.roomTypeId"
              placeholder="请选择房间类型"
              clearable
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
          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              v-model="ruleForm.roomStateId"
              placeholder="请选择房间类型"
              clearable
            >
              <el-option
                v-for="item in roomStateList"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <quill-editor
              ref="myQuillEditor"
              v-model="ruleForm.description"
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
    <!-- 弹出框 -->
    <el-dialog
      title="客房图片"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose1"
    >
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible1" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { BASE_RoomImg_URL, Upload_RoomImg_URL } from "../../config";
import { export_json_to_excel } from "../../Excel/Export2Excel";
export default {
  data() {
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间号"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间类型"));
      } else {
        callback();
      }
    };
    var validateRoomStateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间状态"));
      } else {
        callback();
      }
    };
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间描述"));
      } else {
        callback();
      }
    };
    return {
      fileList: "",
      roomId: "",
      BASE_RoomImg_URL,
      Upload_RoomImg_URL,
      dialogImageUrl: "",
      dialogVisible: false,
      dialogVisible1: false,
      pageIndex: 1,
      count: 0,
      tableData: [],
      roomTypeId: "",
      roomStateId: "",
      roomTypeList: [],
      roomTypeListToSearch: [],
      roomStateList: [],
      roomStateListToSearch: [],
      drawer: false,
      isAdd: true,
      direction: "rtl",
      ruleForm: {
        roomId: "",
        roomTypeId: "",
        roomStateId: "",
        description: "",
      },
      rules: {
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "blur" }],
        roomStateId: [{ validator: validateRoomStateId, trigger: "blur" }],
        description: [{ validator: validateDescription, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getTableData();
    this.getRoomTypeList();
    this.getRoomStateList();
  },
  methods: {
    // addRole(){
    //   this.$post('/')
    // },
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
      let { data, count } = await this.$get("/Room/List", {
        roomTypeId: this.roomTypeId || 0,
        roomStateId: this.roomStateId || 0,
        pageIndex: this.pageIndex,
      });
      this.tableData = data;
      this.count = count;
    },
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
      this.roomTypeListToSearch = res;
    },
    async getRoomStateList() {
      let res = await this.$get("/RoomState/List");
      this.roomStateListToSearch = res;
      let res2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList = res2;
    },
    async handleShowImg(index, row) {
      this.dialogVisible = true;
      this.roomId = row.roomId;
      let res = await this.$get("/RoomImg/List", { roomId: this.roomId });
      this.fileList = res.map((val) => {
        return {
          roomImgId: val.roomImgId,
          name: val.imgUrl,
          url: this.BASE_RoomImg_URL + val.imgUrl,
        };
      });
    },
    handleClose1(done) {
      this.fileList = [];
      done();
    },
    async handleRemove(file, fileList) {
      let { roomImgId, name } = file;
      let { success, message } = await this.$post("/RoomImg/Delete", {
        roomImgId,
        filename: name,
      });
      if (success) {
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    async handleAvatarSuccess(res) {
      let { success, filename, message } = res;
      if (success) {
        let res = await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename,
        });
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },
    beforeAvatarUpload(file) {
      const img_type_list = ["image/jpeg", "image/png", "image/gif"];
      const isValid = img_type_list.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isValid) {
        this.$message.error("上传客房图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传客房图片大小不能超过 2MB!");
      }
      return isValid && isLt2M;
    },
    async handleEdit(index, row) {
      let roomId = row.roomId;
      let res = await this.$get("/Room/GetOne", { roomId });
      this.ruleForm = res;
      this.ruleForm.id = res.roomId;
      this.isAdd = false;
      this.drawer = true;
    },
    async handleDelete(index, row) {
      await this.$confirm("是否确认删除？");
      let roomId = row.roomId;
      // let res = await this.$post("/Admin/Delete", { loginId });
      // console.log(res);
      let { success, message } = await this.$post("/Room/Delete", {
        roomId,
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
              "/Room/Add",
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
              "/Room/Update",
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
        roomId: "",
        roomTypeId: "",
        roomStateId: "",
        description: "",
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
