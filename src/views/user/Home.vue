<template>
  <div>
    <div ref="main" class="main"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      totalTypePrice: [],
    };
  },
  async mounted() {
    let res = await this.$get("/RoomType/TotalTypePrice");
    this.totalTypePrice = res;
    var myChart = echarts.init(this.$refs.main);
    // 绘制图表
    myChart.setOption({
      title: {
        text: "客房类型销售额统计",
      },
      tooltip: {},
      xAxis: {
        data: this.totalTypePrice.map((v) => v.roomtypeName),
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: this.totalTypePrice.map((v) => v.totalMoney),
        },
      ],
    });
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 900px;
  height: 500px;
}
</style>
