document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskHistoryList = document.getElementById("taskHistory");
  const deadlineInput = document.getElementById("deadlineInput");
  const alarmSound = document.getElementById("alarmSound");

  addTaskBtn.addEventListener("click", function () {
    const deadlineValue = deadlineInput.value;

    if (deadlineValue) {
      const deadlineDate = new Date(deadlineValue);

      if (isNaN(deadlineDate.getTime())) {
        // Hiển thị thông báo nếu định dạng thời gian không hợp lệ
        Swal.fire({
          icon: "error",
          title: "Invalid date format",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      // Thêm task vào danh sách lịch sử
      const taskItem = document.createElement("li");
      const taskText = `Task deadline: ${deadlineDate.toLocaleString()}`;
      taskItem.textContent = taskText;
      taskHistoryList.appendChild(taskItem);
      alarmSound.play();

      // Thông báo và chơi âm thanh khi commit task thành công
      Swal.fire({
        icon: "success",
        title: "Task committed successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Lấy văn bản công việc và thời gian
      const taskWithTime = `${taskText} - ${new Date().toLocaleString()}`;
      console.log("Task with time:", taskWithTime);
    } else {
      // Hiển thị thông báo nếu deadline không được nhập
      Swal.fire({
        icon: "error",
        title: "Please enter a deadline",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    // Đặt giá trị input về rỗng sau khi commit
    deadlineInput.value = "";
  });
});
