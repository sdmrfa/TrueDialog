import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  maxConcurrent: 10,
  minTime: 100,
});

limiter.on('error', function (error) {
  console.warn(`Job failed with error: ${error}`);
});

limiter.on('failed', (error, jobInfo) => {
  const id = jobInfo.options.id;
  console.warn(`Job ${id} failed: ${error}`);

  if (jobInfo.retryCount === 0) {
    // Here we only retry once
    console.log(`Retrying job ${id} in 100ms!`);
    return 100;
  }
});

export default limiter;
