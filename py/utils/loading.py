import sys
import time
import threading


class LoadingSpinnerThread(threading.Thread):
    def __init__(self, text, stop_event):
        super(LoadingSpinnerThread, self).__init__()
        self.stop_event = stop_event
        self.text = text

    def run(self):
        spinner = ['-', '\\', '|', '/']
        i = 0

        while not self.stop_event.is_set():
            sys.stdout.write("\r" + spinner[i] + " " + self.text)
            sys.stdout.flush()
            # Adjust the sleep time to control the speed of the animation
            time.sleep(0.1)
            i = (i + 1) % len(spinner)

        sys.stdout.write("\r" + " " * (len(self.text) + 2) + "\r")
        sys.stdout.flush()


def loading_spinner(text):
    stop_event = threading.Event()
    spinner_thread = LoadingSpinnerThread(text, stop_event)
    spinner_thread.start()
    return spinner_thread, stop_event


def stop_loading_spinner(spinner_thread, stop_event):
    stop_event.set()
    spinner_thread.join()
