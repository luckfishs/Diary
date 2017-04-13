<script>
			var contents = document.getElementById("tab");
			var tilte = document.getElementById("title");
			var contents = document.getElementById("content");
			function saveContent(){
				var dbApp = {
				//创建数据库
				openDb: function() {
					this.db = openDatabase("Diary", 1.0, "心情日记数据库", 1024 * 1024 * 5, function() {
						this.alert("创建或打开数据库完成"); //以日志形式打印
					});
				},
				//初始化
				init: function() {
					this.openDb();
					this.bindEvent();
					this.select();
					/*this.alert('初始化完成!');*/
				},

				//绑定事件
				bindEvent: function() {
					//添加事件
					$("#btnInsert").click(this.insert);
					$("#btnUpdate").click(this.update);
					$("#btnCreateTable").click(this.createTable);
					$("#btnDropTable").click(this.dropTable);
				},

				//显示提示信息
				/*log: function(info) {
					$("#msg")[0].innerHTML += info + "<br/>";
				},*/

				//通用函数，
				//参数sql：将要执行的语句
				//respText：响应出去的文字
				//param：执行语句中将要带的参数
				//callback：将要调用的回调函数
				exeSql: function(sql, respText, param, callback) {
					respText = respText || "操作";
					this.db.transaction(function(tx) {
						tx.executeSql(
							sql, param || [],
							function(tx, result) {
								dbApp.alert(respText + '成功！');
								if(callback) { //如果回调函数有参数，将result丢进去
									callback(result);
								}
							},
							function(tx, error) {
								dbApp.alert(respText + "失败了" + error.message);
							});
					});
				},

				//	创建表
				createTable: function() {
					dbApp.exeSql(
						"create table if not exists diarys(id integer primary key autoincrement,title text not null,content text not null)",
						"创建表"
					);
				},

				//删除表
				dropTable: function() {
					dbApp.exeSql(
						"drop table IF EXISTS diarys", "删除表"
					);
				},
				//查询数据
				select: function() {
					dbApp.exeSql("select id,title,content from diarys", "查询", [],
						function(result) {
							for(var i = 0; i < result.rows.length; i++) {
								var tr = $("<tr/>");
								//将数据从结果中输出，追加到相应的行中，最后添加到表格中
								$("<td/>").text(result.rows.item(i)["bid"]).appendTo(tr);
								$("<td/>").text(result.rows.item(i)["bname"]).appendTo(tr);
								$("<td/>").text(result.rows.item(i)["bauthor"]).appendTo(tr);
								$("<td/>").text(result.rows.item(i)["bprice"]).appendTo(tr);
								//通过id来获得要删除，更新的对象
								var del = $("<a href='#' onclick='dbApp.del(" + result.rows.item(i)["bid"] + ",this)' >删除 | </a>")
								var edit = $("<a href='#' onclick='dbApp.edit(" + result.rows.item(i)["bid"] + ",this)' >修改</a>")
								$("<td/>").append(del).append(edit).appendTo(tr);
								tr.appendTo("#tabBooks");
							}
						});
				},

				//插入数据
				insert: function() {
					dbApp.exeSql("insert into diarys(title,content) values(?,?)", "插入数据", [$("#title").val(), $("#content").val()],
						function() {
							dbApp.select();
						});
				},

				//删除数据
				del: function(id, link) {
					dbApp.exeSql("delete from title where id=?", "删除", [id],
						function() {
							/*$(link).closest("tr").remove();*/
						});
				},
				//编辑数据
				edit: function(id) {
					dbApp.exeSql("select id,title,content diarys where id=?", "编辑", [id],
						function(result) {
							$("#title").val(result.rows.item(0)["title"]);
							$("#content").val(result.rows.item(0)["content"]);
							$("#Id").val(result.rows.item(0)["id"]);
							dbApp.alert("修改后请保存");
						});
				},
				
				update: function() {
					if($("#Id")) {
						var sql = "update diarys set title=?,content=? where id=?";
						var a = [$("#title").val(), $("#content").val() $("#Id").val()];
						var respText = "更新";
						dbApp.exeSql(sql, respText, a, function() {
							dbApp.select();
							$("#Id").val("");
						});
					}

				}
			}

			dbApp.init();
			}
		</script>