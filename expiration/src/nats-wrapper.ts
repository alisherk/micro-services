import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  public connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((res, rej) => {
      this.client.on('connect', () => {
        console.log('Connected to NATs');
        res();
      });

      this.client.on('error', (err: Error) => {
        rej(err);
      });
    });
  }

  public shutDownGraceFully() {
    this.client.on('close', () => {
      console.log('NATs connection closed');
      
      process.exit();
    });

    process.on('SIGINT', () => this.client.close());

    process.on('SIGERM', () => this.client.close());
  }
}

export const natsWrapper = new NatsWrapper();
